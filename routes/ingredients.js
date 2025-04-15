const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all ingredients
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM ingredient ORDER BY idinventory');
  res.json(result.rows);
});

// Add ingredient
router.post('/', async (req, res) => {
  const { item, quantity } = req.body;
  await db.query('INSERT INTO ingredient (item, quantity) VALUES ($1, $2)', [item, quantity]);
  res.status(201).json({ message: 'Ingredient added' });
});

// Update ingredient
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { item, quantity } = req.body;
  await db.query('UPDATE ingredient SET item = $1, quantity = $2 WHERE idinventory = $3', [item, quantity, id]);
  res.json({ message: 'Ingredient updated' });
});

// Delete ingredient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM ingredient WHERE idinventory = $1', [id]);
  res.json({ message: 'Ingredient deleted' });
});

module.exports = router;
