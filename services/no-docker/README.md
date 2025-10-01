No-Docker microservices templates

These templates are small examples of lightweight services you can deploy without Docker. They are intended to be deployed as serverless functions or small Node processes on platforms like Vercel, Railway, Fly, or Cloud Run.

Suggested services:
- product-service (already scaffolded)
- order-service (process orders and push events)
- image-service (Cloudinary signing and image management)
- worker (consume events and send emails / process orders)

Each service should have its own repo or folder and own environment variables. Use message queues (SQS/RabbitMQ) or an eventing system (Inngest) for cross-service communication.
No-Docker microservices scaffold (serverless-friendly)
===================================================

Goal: provide minimal, non-Docker microservice templates you can deploy as independent services (Vercel Serverless, Cloud Run, AWS Lambda, etc.) so the backend can scale horizontally to handle thousands of users.

Principles
- No Docker: services are plain Node.js apps or serverless handlers. Deploy to your platform of choice.
- Use managed infra: MongoDB Atlas, Redis (or managed queue), RabbitMQ/SQS, Cloudinary, Clerk.
- Services are stateless and talk via REST + message queue for async work.

Included templates
- product-service/: example product REST endpoints (GET list, POST create) — serverless handler style.
- order-service/: example order endpoints (POST create) which publish an event to a queue.
- worker/: example queue consumer (process order.created events).

Environment variables (examples)
- MONGODB_URI - MongoDB connection string
- CLERK_API_KEY - Clerk server API key (or use Clerk SDK credentials)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- RABBITMQ_URL or SQS_QUEUE_URL
- REDIS_URL (optional)

How to use
1. Copy a template folder (product-service) to a repo for that service.
2. Fill env vars in your hosting platform.
3. Implement business logic in the handlers and tests.
4. Deploy the service and update frontend to call the new service URLs.

Notes
- These are minimal examples intended to be adapted for your infra and style (Express, Fastify, serverless functions).
- For Vercel, place each handler in the `api/` folder of a separate repo. For Cloud Run, use the start scripts and run the server.
