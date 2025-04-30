const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const db = require('../db/db');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const oAuth2Client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log('🛂 Received ID token from frontend:', idToken);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const name = payload.name.trim();
    console.log('🔍 Extracted and trimmed name:', name);

    const userCheck = await db.query(
      'SELECT idemployee, name FROM employees WHERE name = $1',
      [name]
    );

    console.log('🗄️ DB lookup result:', userCheck.rows);

    if (userCheck.rows.length > 0) {
      const user = userCheck.rows[0];
      console.log('✅ User exists, returning:', user);
      return res.json({
        message: 'Authentication successful',
        userId: user.idemployee,
        name: user.name,
      });
    }

    console.log('🆕 User not found, inserting into DB...');
    const newUser = await db.query(
      'INSERT INTO employees (name, title) VALUES ($1, $2) RETURNING idemployee, name',
      [name, 'Employee']
    );

    const createdUser = newUser.rows[0];
    console.log('✅ New user created:', createdUser);

    res.status(201).json({
      message: 'Authentication successful',
      userId: createdUser.idemployee,
      name: createdUser.name,
    });
  } catch (error) {
    console.error('❌ Error verifying ID token or accessing DB:', error);
    res.status(401).json({ message: 'Invalid ID token' });
  }
});

module.exports = router;
