const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Update path if needed

// ===========================
// 📜 Fetch All Menu Items
// ===========================
router.get('/items', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menu ORDER BY idmenu');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// ===========================
// 📚 Fetch Menu Categories (optional)
// ===========================
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ===========================
// 🔎 Fetch Single Menu Item by ID
// ===========================
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
// 🆕 Add FULL Menu Item (Menu + Ingredients + Inventory)
// ===========================
router.post('/full-add', async (req, res) => {
  const { item, price, ingredients, inventory } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert new menu item
    const menuResult = await client.query(
      'INSERT INTO menu (item, price) VALUES ($1, $2) RETURNING idmenu',
      [item, price]
    );
    const newMenuId = menuResult.rows[0].idmenu;

    // Insert linked ingredients
    for (const ing of ingredients) {
      await client.query(
        'INSERT INTO menu_ingredients (idmenu, idingredient, quantity_needed) VALUES ($1, $2, $3)',
        [newMenuId, ing.idingredient, ing.quantity_needed]
      );
    }

    // Insert linked inventory
    for (const inv of inventory) {
      await client.query(
        'INSERT INTO menu_inventory (idmenu, idinventory, quantity_needed) VALUES ($1, $2, $3)',
        [newMenuId, inv.idinventory, inv.quantity_needed]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ message: 'Menu item and associations added!', idmenu: newMenuId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error adding full menu item:', err);
    res.status(500).json({ error: 'Failed to add menu item with ingredients and inventory' });
  } finally {
    client.release();
  }
});

// ===========================
// ✏️ Update Menu Item
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
// 🗑️ Delete Menu Item
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
