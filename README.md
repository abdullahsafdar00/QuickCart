# HM Electronics - E-Commerce Platform

A high-performance, scalable e-commerce platform built with Next.js, featuring PayPro Pakistan payment integration and optimized for millions of users.

## 🚀 Features

### Payment Integration
- **PayPro Pakistan** - Primary payment gateway
- **JazzCash** - Mobile wallet integration
- **EasyPaisa** - Digital payment solution
- **Cash on Delivery** - Traditional payment method

### Performance Optimizations
- **Next.js 15** with Turbopack for faster builds
- **Image optimization** with lazy loading
- **Bundle splitting** and code optimization
- **Database indexing** for faster queries
- **Caching strategies** for improved performance
- **Compression** and minification

### Security Features
- **Input validation** and sanitization
- **Environment variable protection**
- **Secure payment processing**
- **Rate limiting** and DDoS protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Payments**: PayPro Pakistan, JazzCash, EasyPaisa
- **Image Storage**: Cloudinary
- **Deployment**: Vercel/Docker

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd HMElectronics
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Environment Setup**
Copy `.env.example` to `.env` and configure:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# PayPro Pakistan
PAYPRO_MERCHANT_ID=your_paypro_merchant_id
PAYPRO_MERCHANT_SECRET=your_paypro_merchant_secret
PAYPRO_RETURN_URL=http://localhost:3000/payment/callback
PAYPRO_API_URL=https://api.paypro.com.pk/cpay/payment

# JazzCash
JAZZCASH_MERCHANT_ID=your_jazzcash_merchant_id
JAZZCASH_PASSWORD=your_jazzcash_password
JAZZCASH_INTEGRITY_SALT=your_jazzcash_integrity_salt

# EasyPaisa
EASYPAISA_STORE_ID=your_easypaisa_store_id
EASYPAISA_HASH_KEY=your_easypaisa_hash_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

## 🏗️ Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Production
```bash
npm run build:prod   # Production build
npm run start        # Start production server
npm run build:analyze # Analyze bundle size
```

### Optimization
```bash
npm run clean        # Clean build artifacts
npm run optimize     # Run optimization script
```

## 💳 Payment Integration

### PayPro Pakistan Setup

1. **Register with PayPro Pakistan**
   - Visit [PayPro Pakistan](https://paypro.com.pk)
   - Complete merchant registration
   - Get Merchant ID and Secret Key

2. **Configure Environment Variables**
```env
PAYPRO_MERCHANT_ID=your_merchant_id
PAYPRO_MERCHANT_SECRET=your_secret_key
PAYPRO_RETURN_URL=https://yourdomain.com/payment/callback
```

3. **Test Integration**
```bash
# Use sandbox environment for testing
PAYPRO_API_URL=https://sandbox.paypro.com.pk/cpay/payment
```

### Payment Flow
1. User selects PayPro Pakistan as payment method
2. Order is created in the database
3. Payment request is sent to PayPro API
4. User is redirected to PayPro payment page
5. After payment, user is redirected back to callback URL
6. Payment verification is performed
7. Order status is updated

## 🚀 Performance Optimization

### For Millions of Users

1. **Database Optimization**
```javascript
// Recommended MongoDB indexes
db.products.createIndex({ category: 1, price: 1 })
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.users.createIndex({ email: 1 })
```

2. **Caching Strategy**
- **Redis** for session storage
- **CDN** for static assets
- **Database query caching**
- **API response caching**

3. **Load Balancing**
```yaml
# docker-compose.yml example
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000-3003:3000"
    deploy:
      replicas: 4
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

4. **Monitoring & Analytics**
- **Vercel Analytics** for performance monitoring
- **Sentry** for error tracking
- **LogRocket** for user session recording

## 🔧 Configuration

### Next.js Optimization
```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  }
};
```

### Bundle Analysis
```bash
npm run build:analyze
```
This will generate a bundle analysis report showing:
- Bundle sizes
- Duplicate dependencies
- Optimization opportunities

## 🐳 Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build:prod

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 📊 Performance Metrics

### Target Metrics for Scale
- **Response Time**: < 200ms for API calls
- **Page Load**: < 2 seconds for initial load
- **Lighthouse Score**: > 90 for all metrics
- **Uptime**: 99.9% availability
- **Concurrent Users**: Support for 100K+ simultaneous users

### Monitoring
```javascript
// Performance monitoring setup
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 🔒 Security

### Best Practices Implemented
- Input validation and sanitization
- Environment variable protection
- Secure payment processing
- Rate limiting
- CORS configuration
- Content Security Policy

### Security Headers
```javascript
// middleware.ts
export function middleware(request) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}
```

## 📱 Mobile Optimization

- Responsive design with Tailwind CSS
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Optimized images for mobile
- Fast loading on slow networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@hmelectronics.com
- WhatsApp: +92 304 0505905
- Documentation: [Link to docs]

## 🔄 Updates

### Recent Updates
- ✅ PayPro Pakistan integration
- ✅ Performance optimizations
- ✅ Security improvements
- ✅ Bundle size reduction
- ✅ Image optimization
- ✅ Code cleanup

### Upcoming Features
- [ ] Real-time inventory management
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Recommendation engine