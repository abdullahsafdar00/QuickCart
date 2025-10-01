HMElectronics — Product Service

This is a small Express + Mongoose microservice that serves product data for the HMElectronics storefront. It's a scaffold intended for a serverless-friendly deployment (Vercel, Cloud Run, Railway).

How to run locally:

- copy `.env.example` to `.env` and set MONGODB_URI
- npm install
- npm run dev

Notes:
- Replace the simple header-based auth (x-user-id / x-user-role) with Clerk server verification when integrating with the main app.
- Consider adding Redis for caching and a CDN in front of the product GET endpoints for scale.
HMElectronics — product-service
================================

This small service provides product catalog endpoints you can deploy separately from the monolith.

Endpoints
- GET /products — list products (supports ?category=&limit=)
- GET /products/:id — get product by id
- POST /products — create a product (seller-only)

Auth
- For the scaffold, we accept two headers for quick testing:
  - x-user-id: the id of the user
  - x-user-role: role of the user (must be 'seller' to create products)
- Replace header-based auth with Clerk server verification in production.

Run locally
- install: npm install
- start: npm run dev

Deploy
- Deploy as a standalone Node service (Cloud Run, ECS, or a serverless container). For Vercel, convert handlers to serverless functions.
