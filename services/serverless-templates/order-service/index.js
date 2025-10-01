require('dotenv').config();
const express = require('express');
const amqplib = require('amqplib');

const app = express();
app.use(express.json());

async function publishEvent(eventType, payload) {
  if (!process.env.RABBITMQ_URL) {
    console.log('No RABBITMQ_URL configured; skipping publish (dev fallback)');
    return;
  }
  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  const exch = 'events';
  await ch.assertExchange(exch, 'topic', { durable: true });
  ch.publish(exch, eventType, Buffer.from(JSON.stringify(payload)), { persistent: true });
  await ch.close();
  await conn.close();
}

app.post('/orders', async (req, res) => {
  const order = req.body;
  // TODO: validate + persist order in a DB
  console.log('Received order', order.id || '(no id)');
  try {
    await publishEvent('order.created', order);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to publish event', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const port = process.env.PORT || 5010;
app.listen(port, () => console.log('Order-service listening on', port));
