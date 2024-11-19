// routes/leaderboard.routes.js
const express = require('express');
const Leaderboard = require('../models/Leaderboard.model');
const router = express.Router();

// GET /leaderboard - Get the current leaderboard
router.get('/', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findAll({
      order: [['voteCount', 'DESC']],
      limit: 10,
    });
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch leaderboard' });
  }
});

module.exports = router;
