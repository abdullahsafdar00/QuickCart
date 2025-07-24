This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Courier Integration (M&P, Trax, Leopard)

### How it Works
- At checkout, users can select a courier (M&P, Trax, Leopard).
- The backend books the shipment (mocked for now) and stores tracking info in the order.
- Users and sellers can view courier and tracking info in their order history.
- The system auto-suggests the best courier based on city (extra value).

### How to Test
- Place an order via the UI, select a courier, and complete checkout.
- Check the order in "My Orders" and "Seller Orders" for courier and tracking info.
- To run backend tests: `npm test` (Jest)

### How to Integrate Real Courier APIs
- Replace the mock courier booking logic in `app/api/order/create/route.js` with real API calls.
- Store API credentials securely (e.g., in environment variables).
- Update the frontend to display real-time tracking info if available.

For more details, see code comments in the relevant files.
