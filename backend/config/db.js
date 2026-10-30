const mongoose = require('mongoose');

/**
 * Connects to MongoDB.
 *
 * If USE_MEMORY_DB=true is set in .env or if the remote MONGO_URI fails to connect,
 * spins up an in-memory MongoDB instance (via mongodb-memory-server) automatically.
 * This guarantees the server always runs smoothly without crashing.
 */
let memoryServer = null;

const connectDB = async () => {
  const tryMemoryDB = async () => {
    try {
      if (!memoryServer) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
      }
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`Using In-Memory MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.warn(`In-Memory MongoDB not available in production: ${memErr.message}`);
      return null;
    }
  };

  if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGO_URI) {
    return await tryMemoryDB();
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // If dev dependencies like mongodb-memory-server are available, fallback; otherwise don't crash the server
    try {
      return await tryMemoryDB();
    } catch (e) {
      console.warn('Proceeding without in-memory fallback.');
    }
  }
};

module.exports = connectDB;
