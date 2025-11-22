const db = require("../config/db");

// Find a link by its short code
async function findbyCode(code) {
     // Query the database for a link with the given code
    const {rows} = await db.query("SELECT code, target_url, total_clicks, last_clicked, created_at, deleted FROM links WHERE code=$1",[code]);
    return rows[0];   
}

// Insert a new short link into the database
async function insertLink(code,target_url) {
     // Insert a new link into the 'links' table
    await db.query("INSERT INTO links(code,target_url) VALUES ($1,$2)",[code,target_url]);
    
}

// Mark a link as deleted (soft delete)
async function markDeleted(code) {
    // Update 'deleted' field to true only if it is currently false
const res = await db.query('UPDATE links SET deleted=true WHERE code=$1 AND deleted=false', [code]);
return res.rowCount;
}

// List all links, optionally filtered by search query
async function listLinks(q) {
if (q) {
    // If a search query is provided, use ILIKE for case-insensitive matching
const like = `%${q}%`;
const { rows } = await db.query(
'SELECT code, target_url, total_clicks, last_clicked, created_at FROM links WHERE deleted=false AND (code ILIKE $1 OR target_url ILIKE $1) ORDER BY created_at DESC',
[like]
);
return rows;
}

// If no query is provided, return all non-deleted links
const { rows } = await db.query('SELECT code, target_url, total_clicks, last_clicked, created_at FROM links WHERE deleted=false ORDER BY created_at DESC');
return rows;
}

module.exports = { findbyCode, insertLink, markDeleted, listLinks };