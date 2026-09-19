const mongoose = require('mongoose');

/**
 * Connects to MongoDB.
 *
 * If USE_MEMORY_DB=true is set in .env, spins up an in-memory MongoDB
 * instance (via mongodb-memory-server) instead of connecting to a real
 * database. This is great for local testing/demo purposes — no MongoDB
 * install or Atlas account needed. Data is wiped when the server stops.
 */
const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      uri = mem.getUri();
      console.log('Using in-memory MongoDB for this session (data will not persist).');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
