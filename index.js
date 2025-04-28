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
const orderRoutes = require('./routes/orders');
const employeeRoutes = require('./routes/employees');
const ingredientRoutes = require('./routes/ingredients');
const inventoryRoutes = require('./routes/inventory');
const associationRoutes = require('./routes/associations'); // optional if needed

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend33-v41s.onrender.com'], // Allow both local and production origins
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); // For parsing JSON in request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data if needed

// View Engine (optional if you're using EJS views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (optional - for frontend assets if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Google OAuth setup
const CLIENT_ID = process.env.CLIENT_ID;
const oAuth2Client = new OAuth2Client(CLIENT_ID);

// Google OAuth route
app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload.sub; // Google user ID
    const email = payload.email;
    const name = payload.name; // Get the user's name from the payload

    // Optionally, store user info in the database here

    // Send the user's name and email in the response
    res.json({ message: 'Authentication successful', userId, email, name });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ message: 'Invalid ID token' });
  }
});
// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/associations', associationRoutes);
// Root Route
app.get('/', (req, res) => {
  res.send('🍵 Welcome to LeBoba POS Backend API!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});