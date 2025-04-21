const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// Import routes
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders'); // Import the orders route
require('dotenv').config();

app.use('/api/orders', orderRoutes); // Register the orders route


const cors = require('cors');
// const express = require('express');

app.use(cors()); // Allow all origins (for development) scary


// Middleware
app.use(express.json()); // For parsing JSON in request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data if needed

// View Engine (optional)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/carts', cartRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🍵 Welcome to LeBoba POS Backend API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});