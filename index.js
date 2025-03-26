// index.js
const express = require('express');
const app = express();
const path = require('path');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/carts');
require('dotenv').config();


const cors = require('cors');
// const express = require('express');

app.use(cors()); // Allow all origins (for development) scary


// Middleware
app.use(express.json()); // For parsing JSON in request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data if needed

// View Engine (optional if you're using EJS views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (optional - for frontend assets if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/carts', cartRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('🍵 Welcome to LeBoba POS Backend API!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
