const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Your database connection

// Place an order
router.post('/', async (req, res) => {
  const { totalPrice, selectedItems, employeeId } = req.body;

  console.log('Received payload:', { totalPrice, selectedItems, employeeId });

  // Basic validation
  if (!totalPrice || !Array.isArray(selectedItems) || selectedItems.length === 0 || !employeeId) {
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  try {
    // Validate employee ID
    const employeeCheck = await db.query(
      'SELECT * FROM employees WHERE idemployee = $1',
      [employeeId]
    );

    if (employeeCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    // Insert order into the orders table with idmenu as an array
    const result = await db.query(
      'INSERT INTO orders (totalprice, idmenu, idemployee) VALUES ($1, $2, $3) RETURNING idorder',
      [totalPrice, selectedItems, employeeId]
    );

    const orderId = result.rows[0].idorder;

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      totalPrice,
      selectedItems,
    });
  } catch (error) {
    console.error('Error placing order:', error.message);
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
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = router;
