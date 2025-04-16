const express = require('express');
const router = express.Router();
const db = require('../db/db');

// ✅ Add employee
router.post('/', async (req, res) => {
  const { name, title } = req.body;

  if (!name || !title) {
    return res.status(400).json({ error: 'Missing name or title' });
  }

  try {
    const result = await db.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING *',
      [name, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

module.exports = router;