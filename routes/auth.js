const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const db = require('../db/db'); // Import your database connection
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const oAuth2Client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const name = payload.name; // Use name as the unique identifier

    // Check if the user exists in the database
    const userCheck = await db.query(
      'SELECT idemployee, name FROM employees WHERE name = $1',
      [name]
    );

    if (userCheck.rows.length > 0) {
      // User exists, return their database userId
      const user = userCheck.rows[0];
      return res.json({
        message: 'Authentication successful',
        userId: user.idemployee,
        name: user.name,
      });
    }

    // If the user does not exist, create a new user in the database
    const newUser = await db.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING idemployee, name',
      [name, 'Employee'] // Default title is 'Employee'
    );

    const createdUser = newUser.rows[0];
    res.status(201).json({
      message: 'Authentication successful',
      userId: createdUser.idemployee,
      name: createdUser.name,
    });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ message: 'Invalid ID token' });
  }
});

module.exports = router;