const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust as needed

// Place an order
router.post('/', async (req, res) => {
  const { totalPrice, selectedItems } = req.body;

  // ✅ Basic validation
  if (!totalPrice || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  try {
    // ✅ Place the order (hardcoded employee ID 1)
    const result = await db.query(
      'INSERT INTO orders (totalprice, idmenu, idemployee) VALUES ($1, $2, $3) RETURNING idorder',
      [totalPrice, selectedItems, 1]
    );

    const orderId = result.rows[0].idorder;
    res.status(201).json({ message: 'Order placed successfully', orderId });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
