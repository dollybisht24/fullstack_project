const mongoose = require('mongoose');

const connectDB = async (mongoURI) => {
  try {
    // Use MongoDB Atlas free cluster
    const uri = mongoURI || process.env.MONGODB_URI || 'mongodb+srv://nykaauser:nykaapass123@cluster0.pqk4w.mongodb.net/nykaa-clone?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn('Server will continue. Signup/login use the dev fallback; database-backed routes return 503 until MongoDB is connected.\n');
    // Don't exit - let server run for static routes
  }
};

module.exports = connectDB;
