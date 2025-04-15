const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all inventory items
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM inventory ORDER BY idinventory');
  res.json(result.rows);
});

// Add new inventory item
router.post('/', async (req, res) => {
  const { item, quantity } = req.body;
  await db.query('INSERT INTO inventory (item, quantity) VALUES ($1, $2)', [item, quantity]);
  res.status(201).json({ message: 'Inventory item added' });
});

// Update inventory item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { item, quantity } = req.body;
  await db.query('UPDATE inventory SET item = $1, quantity = $2 WHERE idinventory = $3', [item, quantity, id]);
  res.json({ message: 'Inventory updated' });
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM inventory WHERE idinventory = $1', [id]);
  res.json({ message: 'Inventory deleted' });
});

module.exports = router;
