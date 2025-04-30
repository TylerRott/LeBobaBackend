const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust as needed

// Place an order
router.post('/', async (req, res) => {
  const { totalPrice, selectedItems, employeeId } = req.body;

  // Log the received payload for debugging
  console.log('Received payload:', { totalPrice, selectedItems, employeeId });

  // Basic validation
  if (!totalPrice || !Array.isArray(selectedItems) || selectedItems.length === 0 || !employeeId) {
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  try {
    // Validate employeeId
    const employeeCheck = await db.query(
      'SELECT * FROM employees WHERE idemployee = $1',
      [employeeId]
    );

    if (employeeCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    // Insert order into the orders table
    const result = await db.query(
      'INSERT INTO orders (totalprice, idemployee) VALUES ($1, $2) RETURNING idorder',
      [totalPrice, employeeId]
    );

    const orderId = result.rows[0].idorder;

    // Insert each selected item into the order_items table
    for (const itemId of selectedItems) {
      await db.query(
        'INSERT INTO order_items (idorder, idmenu) VALUES ($1, $2)',
        [orderId, itemId]
      );
    }

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      totalPrice,
      selectedItems,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Retrieve orders from the last 24 hours
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
      orders: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = router;