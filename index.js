const express = require('express');
const app = express();
const path = require('path');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory'); // ✅ Make sure this file exists
const ingredientRoutes = require('./routes/ingredients'); // ✅ Make sure this file exists
const associationRoutes = require('./routes/associations'); // Optional, only if you're handling mapping

require('dotenv').config();
const cors = require('cors');

app.use(cors()); // Allow all origins

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine (optional)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static (optional)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use('/api/menu', menuRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);      // ✅ Add this
app.use('/api/ingredients', ingredientRoutes);    // ✅ Add this
app.use('/api/associations', associationRoutes);  // ✅ Optional

// Default route
app.get('/', (req, res) => {
  res.send('🍵 Welcome to LeBoba POS Backend API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
