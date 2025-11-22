const express = require('express');
const router = express.Router();
const LinkController = require('../controllers/LinkControllers');

// Create a new short link
router.post('/', LinkController.create);

// List all links, optionally filtered by query
router.get('/', LinkController.list);

// Get statistics for a specific short link
router.get('/:code', LinkController.stats);

// Soft-delete a short link
router.delete('/:code', LinkController.remove);


module.exports = router;