// Worker template — consumes order.created events and processes them (send emails, update inventory)
require('dotenv').config();

console.log('Worker starting — replace with real queue consumer (RabbitMQ/SQS/Inngest)');

// Example polling loop (replace with real pub/sub)
setInterval(() => {
  // In a real worker, connect to a queue and handle messages.
  console.log('Worker heartbeat — waiting for events...');
}, 10_000);
