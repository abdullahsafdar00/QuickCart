import mongoose from "mongoose";

const catched = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (catched.conn) {
    return catched.conn;
  }

  if (!catched.promise) {
    const opts = {
      bufferCommands: false,
    };

    catched.promise = mongoose
      .connect(`${process.env.MONGODB_URI}`, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  catched.conn = await catched.promise;
  return catched.conn;
}

export default connectDB;