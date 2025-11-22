const db = require("../config/db");
const LinkModel = require("../models/LinkModels");
const { isValidUrl, isValidCode } = require("../utils/validate");

// Characters allowed for auto-generated short codes
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Generate a random short code
function genCode(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++)
    s += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  return s;
}

// Create a new short link
async function createLink({ target_url, code }) {
  // Validate target URL
  if (!target_url) throw { status: 400, message: "target is required_url" };
  if (!isValidUrl(target_url))
    throw { status: 400, message: "invalid target URL" };

  // Trim custom code if provided
  let short = code && String(code).trim();

  if (short) {
    // Validate custom code pattern
    if (!isValidCode(short))
      throw { status: 400, message: "code must match [A-Za-z0-9]{6,8}" };
    // Check if code already exists
    const existing = await LinkModel.findbyCode(short);
    if (existing && !existing.deleted)
      throw { status: 409, message: "code already exists" };
  } else {
    // Auto-generate unique code if no custom code provided
    let attempts = 0;
    do {
      short = genCode(6);
      const existing = await LinkModel.findbyCode(short);
      if (!existing) break;
      attempts++;
    } while (attempts < 5);
    if (!short)
      throw { status: 500, message: "could not generate unique code" };
  }

  try {
    // Insert the new link into the database
    await LinkModel.insertLink(short, target_url);
  } catch (err) {
    // handle unique violation (race)
    if (err.code === "23505")
      throw { status: 409, message: "code already exists" };
    throw err;
  }

  // Return the created link info
  return {
    code: short,
    shortUrl: `${
      process.env.BASE_URL || "http://localhost:" + (process.env.PORT || 5000)
    }/${short}`,
    target_url,
  };
}

// Helper: convert date to IST timezone string
function toIST(date) {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

// Get stats for a short link
async function getLinkStats(code) {
  const row = await LinkModel.findbyCode(code);
  if (!row || row.deleted) throw { status: 404, message: "not found" };
  return {
    code: row.code,
    target_url: row.target_url,
    total_clicks: Number(row.total_clicks),
    last_clicked: toIST(row.last_clicked),
    created_at: toIST(row.created_at),
  };
}

// List all links, optionally filtered by search query
async function listAll(q) {
  const rows = await LinkModel.listLinks(q);
  return rows.map((r) => ({
    code: r.code,
    target_url: r.target_url,
    total_clicks: Number(r.total_clicks),
    last_clicked: r.last_clicked,
    created_at: r.created_at,
  }));
}

// Soft-delete a link
async function deleteLink(code) {
  const n = await LinkModel.markDeleted(code);
  if (n === 0) throw { status: 404, message: "not found" };
  return true;
}

// Redirect logic — increment clicks inside a transaction
async function getAndRedirect(code) {
  // Get a client from pool
  const client = await db.pool.connect();
  try {
    // Start transaction
    await client.query("BEGIN");
    // Lock the row for update to safely increment clicks
    const sel = await client.query(
      "SELECT target_url, deleted FROM links WHERE code=$1 FOR UPDATE",
      [code]
    );
    if (!sel.rows || sel.rows.length === 0 || sel.rows[0].deleted) {
      // Rollback transaction if not found
      await client.query("ROLLBACK");
      throw { status: 404, message: "not found" };
    }
    const target = sel.rows[0].target_url;
    // Increment click count and update last_clicked timestamp
    await client.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = now() WHERE code=$1",
      [code]
    );
    // Commit transaction
    await client.query("COMMIT");
    return target;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (e) {}
    if (err && err.status) throw err;
    throw err;
  } finally {
    // Release client back to pool
    client.release();
  }
}

module.exports = {
  createLink,
  getLinkStats,
  listAll,
  deleteLink,
  getAndRedirect,
};
