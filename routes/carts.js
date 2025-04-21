const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path to your db module

/**
 * POST /add - Place an order into the database
 * Expects:
 * {
 *   totalPrice: number,
 *   selectedItems: [
 *     { idmenu: number, name: string, price: number }
 *   ]
 * }
 */
router.post('/add', async (req, res) => {
  const { totalPrice, selectedItems } = req.body;

  if (!totalPrice || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  try {
    await db.query(
      `INSERT INTO orders (totalprice, idmenu, idemployee)
       VALUES ($1, $2, $3)`,
      [totalPrice, selectedItems, 1]
    );

    res.status(201).json({ message: 'Order stored!' });
  } catch (err) {
    console.error('❌ DB error:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});



module.exports = router;
