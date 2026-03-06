const express = require('express');
const router = express.Router();
const { handlePrompt, getLogs, getStats } = require('../controllers/promptController');

// POST - Analyze and process a prompt
router.post('/prompt', handlePrompt);

// GET - Fetch all prompt logs
router.get('/logs', getLogs);

// GET - Fetch dashboard stats
router.get('/stats', getStats);

module.exports = router;