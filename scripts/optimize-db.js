// Database optimization script
// Run this in MongoDB shell or as a Node.js script

const dbOptimizations = {
  // Create indexes for better query performance
  createIndexes: async (db) => {
    try {
      // Product indexes
      await db.collection('products').createIndex({ category: 1, price: 1 });
      await db.collection('products').createIndex({ category: 1, inStock: 1 });
      await db.collection('products').createIndex({ promotion: 1, date: -1 });
      await db.collection('products').createIndex({ userId: 1, date: -1 });
      await db.collection('products').createIndex({ 
        name: 'text', 
        description: 'text', 
        tags: 'text' 
      });

      // Order indexes
      await db.collection('orders').createIndex({ userId: 1, date: -1 });
      await db.collection('orders').createIndex({ status: 1, date: -1 });
      await db.collection('orders').createIndex({ paymentStatus: 1, paymentMethod: 1 });
      await db.collection('orders').createIndex({ courierTrackingNumber: 1 }, { sparse: true });

      // User indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ clerkId: 1 }, { unique: true });

      // Address indexes
      await db.collection('addresses').createIndex({ userId: 1 });

      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
    }
  },

  // Analyze query performance
  analyzeQueries: async (db) => {
    try {
      // Enable profiler for slow queries (>100ms)
      await db.runCommand({ profile: 2, slowms: 100 });
      
      console.log('✅ Query profiler enabled for queries >100ms');
    } catch (error) {
      console.error('❌ Error enabling profiler:', error);
    }
  },

  // Clean up old data
  cleanup: async (db) => {
    try {
      // Remove old logs (older than 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Clean up old sessions or temporary data if any
      // await db.collection('sessions').deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
      
      console.log('✅ Database cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
};

// MongoDB connection and optimization
const optimizeDatabase = async () => {
  const { MongoClient } = require('mongodb');
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    await dbOptimizations.createIndexes(db);
    await dbOptimizations.analyzeQueries(db);
    await dbOptimizations.cleanup(db);
    
    console.log('🚀 Database optimization completed!');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
  } finally {
    await client.close();
  }
};

// Export for use in other scripts
module.exports = { dbOptimizations, optimizeDatabase };

// Run if called directly
if (require.main === module) {
  optimizeDatabase();
}