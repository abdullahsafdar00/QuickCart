require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Return a server-signed Cloudinary signature and timestamp for client uploads
app.get('/signature', (req, res) => {
  // Replace this header check with Clerk server verification in production
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!userId || role !== 'seller') return res.status(403).json({ success: false });

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET ? `&folder=seller_${userId}` : ''}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + (process.env.CLOUDINARY_API_SECRET || '')).digest('hex');
  res.json({ signature, timestamp });
});

const port = process.env.PORT || 5020;
app.listen(port, () => console.log('Image-service listening on', port));
