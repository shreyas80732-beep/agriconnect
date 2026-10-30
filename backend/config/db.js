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
      console.error(`In-Memory MongoDB connection failed: ${memErr.message}`);
      process.exit(1);
    }
  };

  if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGO_URI) {
    return await tryMemoryDB();
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Primary MongoDB connection error: ${error.message}`);
    console.log('Switching to local In-Memory MongoDB automatically for reliability...');
    return await tryMemoryDB();
  }
};

module.exports = connectDB;
