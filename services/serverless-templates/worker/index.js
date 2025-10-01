require('dotenv').config();
const amqplib = require('amqplib');

async function run() {
  if (!process.env.RABBITMQ_URL) {
    console.error('Set RABBITMQ_URL to connect to RabbitMQ');
    process.exit(1);
  }
  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  const exch = 'events';
  await ch.assertExchange(exch, 'topic', { durable: true });
  const q = await ch.assertQueue('', { exclusive: true });
  await ch.bindQueue(q.queue, exch, 'order.created');
  console.log('Worker: waiting for order.created events...');
  ch.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      console.log('Worker received order:', payload);
      // TODO: perform side-effects: send email, reduce inventory, call shipping
      ch.ack(msg);
    } catch (err) {
      console.error('Worker error processing message', err);
      ch.nack(msg, false, false);
    }
  });
}

run().catch(err => { console.error(err); process.exit(1); });
