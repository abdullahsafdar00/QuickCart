import mongoose from "mongoose";

// Ensure a single mongoose connection across hot-reloads / lambda invocations
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      // prevents mongoose buffering commands while not connected
      bufferCommands: false,
      // sensible defaults for connection pooling
      maxPoolSize: parseInt(process.env.MONGODB_POOLSIZE || "10", 10),
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;