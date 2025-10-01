// Minimal order-service example that receives order payloads and emits events.
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/orders', async (req, res) => {
  const order = req.body;
  // Validate and persist order (in a real service use a DB)
  console.log('Order received', order.id || '(no id)');

  // Emit an event to an eventing system (RabbitMQ / SQS / Inngest)
  // For example: publish to RabbitMQ exchange 'order.created'
  console.log('Emit event: order.created');

  res.status(201).json({ success: true });
});

const port = process.env.PORT || 5010;
app.listen(port, () => console.log('Order-service listening on', port));
