const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// Import routes
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const employeeRoutes = require('./routes/employees');
const ingredientRoutes = require('./routes/ingredients');
const inventoryRoutes = require('./routes/inventory');
const associationRoutes = require('./routes/associations');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend33-v41s.onrender.com'],
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static and views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Use custom /auth route from routes/auth.js
app.use('/auth', authRoutes);

// All other API routes
app.use('/api/menu', menuRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/associations', associationRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('🍵 Welcome to LeBoba POS Backend API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
