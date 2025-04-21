const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
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
    const userId = payload.sub; // Google user ID
    const email = payload.email;

    // Optionally, store user info in the database here

    res.json({ message: 'Authentication successful', userId, email });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ message: 'Invalid ID token' });
  }
});

module.exports = router;