const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust as needed

// Place an order
router.post('/', async (req, res) => {
  const { totalPrice, selectedItems } = req.body;

  // Basic validation
  if (!totalPrice || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  try {
    // Place the order (hardcoded employee ID 1)
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

router.get('/getOrder', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT idorder, totalprice, created_at, idmenu, idemployee 
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '24 hours'
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: result.rows
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = router;
