const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Link menu item to inventory
router.post('/menu-inventory', async (req, res) => {
  const { idmenu, idinventory, quantity_needed } = req.body;
  await db.query('INSERT INTO menu_inventory (idmenu, idinventory, quantity_needed) VALUES ($1, $2, $3)', [idmenu, idinventory, quantity_needed]);
  res.json({ message: 'Inventory linked to menu item' });
});

// Update quantity_needed for menu-inventory link
router.put('/menu-inventory', async (req, res) => {
  const { idmenu, idinventory, quantity_needed } = req.body;
  await db.query('UPDATE menu_inventory SET quantity_needed = $3 WHERE idmenu = $1 AND idinventory = $2', [idmenu, idinventory, quantity_needed]);
  res.json({ message: 'Menu-inventory link updated' });
});

// Remove link
router.delete('/menu-inventory', async (req, res) => {
  const { idmenu, idinventory } = req.body;
  await db.query('DELETE FROM menu_inventory WHERE idmenu = $1 AND idinventory = $2', [idmenu, idinventory]);
  res.json({ message: 'Menu-inventory link removed' });
});

// Repeat for menu-ingredients
router.post('/menu-ingredients', async (req, res) => {
  const { idmenu, idinventory, quantity_needed } = req.body;
  await db.query('INSERT INTO menu_ingredients (idmenu, idinventory, quantity_needed) VALUES ($1, $2, $3)', [idmenu, idinventory, quantity_needed]);
  res.json({ message: 'Ingredient linked to menu item' });
});

router.put('/menu-ingredients', async (req, res) => {
  const { idmenu, idinventory, quantity_needed } = req.body;
  await db.query('UPDATE menu_ingredients SET quantity_needed = $3 WHERE idmenu = $1 AND idinventory = $2', [idmenu, idinventory, quantity_needed]);
  res.json({ message: 'Menu-ingredient link updated' });
});

router.delete('/menu-ingredients', async (req, res) => {
  const { idmenu, idinventory } = req.body;
  await db.query('DELETE FROM menu_ingredients WHERE idmenu = $1 AND idinventory = $2', [idmenu, idinventory]);
  res.json({ message: 'Menu-ingredient link removed' });
});

module.exports = router;
