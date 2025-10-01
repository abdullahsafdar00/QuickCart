require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmelectronics';

mongoose.connect(MONGODB_URI, { autoIndex: true }).then(() => {
  console.log('Product-service connected to Mongo');
}).catch(err => {
  console.error('Product-service Mongo connection error:', err);
  process.exit(1);
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const q = {};
    if (category) q.category = category;
    const products = await Product.find(q).limit(Number(limit)).lean();
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /products/:id
app.get('/products/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, product: prod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /products (seller-only)
app.post('/products', async (req, res) => {
  try {
    // Quick scaffold auth: replace with Clerk server verification in production
    const userId = req.header('x-user-id');
    const role = req.header('x-user-role');
    if (!userId || role !== 'seller') return res.status(403).json({ success: false, message: 'Forbidden' });

    const { name, description, category, price, offerPrice, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Missing name' });

    const doc = await Product.create({ userId, name, description, category, price, offerPrice, image });
    res.status(201).json({ success: true, product: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Product-service listening on ${port}`));
