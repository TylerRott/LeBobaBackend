// routes/menu.js
const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Make sure this path is correct

// Get all menu items (universal list)
router.get('/items', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menu ORDER BY idmenu');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// (Optional) Placeholder: Get categories (not used yet but useful for expansion)
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a single menu item by ID
router.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM menu WHERE idmenu = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

module.exports = router;