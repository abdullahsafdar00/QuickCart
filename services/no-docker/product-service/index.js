// Minimal product-service example (serverless handler)
// Exposes: GET /products, POST /products (seller only)
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { getAuth } = require('@clerk/nextjs/server');

let client;
async function connect() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 10 });
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB || 'hmelectronics');
}

async function isSeller(userId) {
  // Use Clerk REST API or SDK in production
  // Minimal placeholder: accept any userId for now (replace with Clerk lookup)
  return !!userId;
}

module.exports = async function handler(req, res) {
  const db = await connect();
  const collection = db.collection('products');

  if (req.method === 'GET') {
    const products = await collection.find({}).limit(100).toArray();
    return res.status(200).json({ success: true, products });
  }

  if (req.method === 'POST') {
    // Validate Clerk token server-side in production
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!(await isSeller(userId))) return res.status(403).json({ success: false, message: 'Forbidden' });

    const { name, description, price, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Missing name' });
    const doc = { userId, name, description, price: Number(price || 0), image, createdAt: new Date() };
    await collection.insertOne(doc);
    return res.status(201).json({ success: true, product: doc });
  }

  res.setHeader('Allow', 'GET,POST');
  res.status(405).end('Method Not Allowed');
};
