const express = require('express');
const router = express.Router();
let cart = []; // In-memory cart

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/add', (req, res) => {
  const item = req.body;
  cart.push(item);
  res.json({ message: 'Item added to cart', cart });
});

router.post('/clear', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
