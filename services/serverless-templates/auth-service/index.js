require('dotenv').config();
const express = require('express');

const app = express();

// Minimal auth check endpoint. Replace with Clerk server SDK verification when ready.
app.get('/whoami', (req, res) => {
  const userId = req.header('x-user-id') || null;
  const role = req.header('x-user-role') || 'customer';
  res.json({ userId, role });
});

const port = process.env.PORT || 5030;
app.listen(port, () => console.log('Auth-service listening on', port));
