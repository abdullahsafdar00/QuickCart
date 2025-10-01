require('dotenv').config();
const { MongoClient } = require('mongodb');
const amqplib = require('amqplib');
const { getAuth } = require('@clerk/nextjs/server');

let client;
async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB || 'hmelectronics');
}

async function publishOrderEvent(order) {
  if (!process.env.RABBITMQ_URL) {
    console.warn('No RABBITMQ_URL, logging event instead');
    console.log('order.created', order);
    return;
  }
  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  const exch = 'events';
  await ch.assertExchange(exch, 'topic', { durable: true });
  ch.publish(exch, 'order.created', Buffer.from(JSON.stringify(order)), { persistent: true });
  await ch.close();
  await conn.close();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const db = await connectDB();
  const orders = db.collection('orders');
  const order = { ...req.body, userId, createdAt: new Date() };
  const result = await orders.insertOne(order);

  // Publish event for workers
  await publishOrderEvent({ orderId: result.insertedId, userId });

  res.status(201).json({ success: true, orderId: result.insertedId });
};
