const LinkService = require("../services/LinkService");

// Create a new short link
const create = async (req, res) => {
  try {
    // Get target URL and optional custom code from request body
    const { target_url, code } = req.body || {};

    // Call service to create the link
    const result = await LinkService.createLink({ target_url, code });

    // Return created link with 201 status
    return res.status(201).json(result);
  } catch (error) {
    console.error("Controller create error", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "internal" });
  }
};

// List all links, optionally filtered by search query
const list = async (req, res) => {
  try {
    const q = req.query.q;
    const data = await LinkService.listAll(q);
    return res.json(data);
  } catch (error) {
    console.error("Controller list error", error);
    return res.status(500).json({ error: "internal" });
  }
};

// Get statistics for a short link
const stats = async (req, res) => {
  try {
    const { code } = req.params;
    const data = await LinkService.getLinkStats(code);
    return res.json(data);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "internal" });
  }
};

// Delete a short link (soft delete)
const remove = async (req, res) => {
  try {
    const { code } = req.params;
    await LinkService.deleteLink(code);
    return res.status(204).send();
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "internal" });
  }
};

// Redirect to the original URL
const redirect = async (req, res) => {
  try {
    const { code } = req.params;
    const target = await LinkService.getAndRedirect(code);

    // Redirect with HTTP 302 to the target URL
    return res.redirect(302, target);
  } catch (error) {
    if (error.status === 404) return res.status(404).send("Not found");
    console.error("Controller redirect error", error);
    return res.status(500).send("internal");
  }
};

module.exports = { create, list, stats, remove, redirect };
