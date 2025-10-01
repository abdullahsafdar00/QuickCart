Serverless templates (formerly "no-docker")

These are lightweight template services intended to be deployed as serverless functions or small Node.js processes on platforms such as Vercel, Railway, Fly.io or Cloud Run. The folder was renamed from `no-docker` to `serverless-templates` to avoid confusing naming.

Templates included:
- order-service: receive orders, persist, and emit an `order.created` event to a message broker.
- worker: consume `order.created` events and perform side effects (email, inventory updates).

Notes:
- Replace placeholder auth checks with Clerk server verification (or another auth provider).
- Use your platform's secret store for production secrets.
