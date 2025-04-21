const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Update path if needed

// GET /menu/items - Fetch all menu items
router.get('/items', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menu ORDER BY idmenu');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err); 
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET /menu/categories - Fetch menu categories (optional)
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /menu/item/:id - Fetch a specific item by ID
router.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM menu WHERE idmenu = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});


// ===========================
// 🔧 ADDED: Update Menu Item
// ===========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { item, price } = req.body;

  try {
    await db.query(
      'UPDATE menu SET item = $1, price = $2 WHERE idmenu = $3',
      [item, price, id]
    );
    res.json({ message: 'Menu item updated successfully' });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});


// ===========================
// 🗑️ ADDED: Delete Menu Item
// ===========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM menu WHERE idmenu = $1', [id]);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;
