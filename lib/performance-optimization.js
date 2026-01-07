// Performance optimization utilities
export const imageOptimization = {
  // Lazy loading configuration
  lazyLoadConfig: {
    rootMargin: '50px',
    threshold: 0.1
  },
  
  // Image size presets for different components
  imageSizes: {
    thumbnail: { width: 64, height: 64 },
    card: { width: 300, height: 300 },
    hero: { width: 1200, height: 600 },
    product: { width: 800, height: 800 }
  },
  
  // WebP support check
  supportsWebP: () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
};

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic imports for heavy components
  dynamicImports: {
    'framer-motion': () => import('framer-motion'),
    'chart-components': () => import('@/components/charts'),
    'admin-components': () => import('@/components/admin')
  },
  
  // Code splitting points
  splitPoints: [
    '/admin',
    '/seller',
    '/analytics'
  ]
};

// Database query optimization
export const dbOptimization = {
  // Pagination settings
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  
  // Cache settings
  cache: {
    products: 300, // 5 minutes
    categories: 3600, // 1 hour
    user: 1800 // 30 minutes
  },
  
  // Index suggestions
  indexes: [
    { collection: 'products', fields: { category: 1, price: 1 } },
    { collection: 'orders', fields: { userId: 1, createdAt: -1 } },
    { collection: 'users', fields: { email: 1 } }
  ]
};

// API optimization
export const apiOptimization = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Response compression
  compression: {
    threshold: 1024,
    level: 6
  },
  
  // Caching headers
  cacheHeaders: {
    static: 'public, max-age=31536000, immutable',
    api: 'public, max-age=300, s-maxage=600',
    dynamic: 'no-cache, no-store, must-revalidate'
  }
};

export default {
  imageOptimization,
  bundleOptimization,
  dbOptimization,
  apiOptimization
};