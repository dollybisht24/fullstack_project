const mongoose = require('mongoose');

const connectDB = async (mongoURI, options = {}) => {
  try {
    const uri = mongoURI || process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is missing in server/.env');
    }
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }

    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn('Server will continue. Signup/login use the dev fallback; database-backed routes return 503 until MongoDB is connected.\n');
    return null;
  }
};

module.exports = connectDB;
