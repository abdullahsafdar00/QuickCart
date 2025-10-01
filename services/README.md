Microservices scaffold for HMElectronics
=======================================

This folder contains a lightweight scaffold and local orchestration files to help split the current Next.js monolith backend into independent microservices. The goal is to provide a safe, repeatable pattern to create services (product, order, image, auth, worker) and run them locally with Docker Compose.

High-level guidance
- Each service runs in its own Docker container and exposes a small REST API.
- Shared infra in local compose: MongoDB (single instance for local dev), Redis (cache/session), RabbitMQ (message broker) — in production use managed equivalents (MongoDB Atlas, Elasticache, Amazon MQ/SQS, or RabbitMQ Cloud).
- Services should be stateless and scale horizontally. Use environment variables for configuration and credentials.
- Use a message queue for order side-effects (emails, inventory updates). The order service pushes messages; worker(s) consume.
- Use per-service connection pooling and limit pool size according to instance counts.

Local quick start (dev):
- Copy the template service to create a new service (e.g., product-service). Edit routes to implement business logic.
- Start local infra + services using Docker Compose (example below). Build images or use volumes for node_modules during dev.

Production notes
- Deploy services to managed container platforms (ECS/Fargate, GKE/AKS/EKS, Cloud Run) with autoscaling.
- Use managed MongoDB (Atlas) and Redis. Use Cloudinary (or S3 + CDN) for images.
- Put a load balancer in front of the services and use API Gateway if helpful. The front-end (Vercel) should call the service cluster endpoints.
- Add observability (metrics, logs, tracing) and a centralized secrets store.

Files in this folder:
- docker-compose.yml — local stack (Mongo, Redis, RabbitMQ) and a placeholder for services
- template/ — a minimal Express service template you can copy for each microservice
- worker-template/ — a simple RabbitMQ worker template for background jobs

Next steps to convert the monolith:
1. Identify domains: products, orders, users/auth, images, payments, analytics.
2. Implement smallest service first (product-service) by moving relevant API routes and DB models. Keep the Frontend pointing to new service URLs via env.
3. Introduce message queue patterns for eventual consistency (order.created -> worker -> notifications, inventory).
4. Replace shared monolithic DB calls with service-owned collections and clearly defined contracts.
5. Add observability and autoscaling rules; run load tests and iterate.

Security note
- Keep Cloudinary API secret on the server (image-service); do not expose it client-side. Use signed uploads or route uploads through the image microservice.
