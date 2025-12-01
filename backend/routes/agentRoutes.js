// routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');

// POST /api/agents (create)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const count = await Agent.countDocuments();
    if (count >= 5) {
      return res
        .status(400)
        .json({ message: 'Maximum of 5 agents allowed' });
    }

    const agent = await Agent.create({ name, email, mobile, password });
    res.status(201).json(agent);
  } catch (err) {
    console.error('Create agent error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/agents (list)
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    console.error('Get agents error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
