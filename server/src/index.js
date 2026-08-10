const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const authFallbackRoutes = ['/api/users/register', '/api/users/login'];

const canUseAuthFallback = (req) =>
  req.method === 'POST' && authFallbackRoutes.includes(req.path);

const defaultAuthUsers = [
  {
    name: 'Admin User',
    email: 'admin@nykaa.com',
    password: 'admin123',
    isAdmin: true,
    isVerified: true,
    phone: '+91 9876543210',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    isVerified: true,
    phone: '+91 9876543211',
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya@example.com',
    password: 'password123',
    isVerified: true,
    phone: '+91 9876543212',
  },
]

const seedDefaultAuthUsers = async () => {
  for (const userData of defaultAuthUsers) {
    const existingUser = await User.findOne({ email: userData.email })
    if (!existingUser) {
      await User.create(userData)
    }
  }
}

let dbConnectionPromise = null;

const ensureDatabaseConnection = async (req, res, next) => {
  if (
    !req.path.startsWith('/api/') ||
    mongoose.connection.readyState === 1 ||
    canUseAuthFallback(req)
  ) {
    return next();
  }

  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB(process.env.MONGODB_URI);
    }

    await dbConnectionPromise;
    next();
  } catch (error) {
    dbConnectionPromise = null;
    next(error);
  }
};

app.use(ensureDatabaseConnection);

// Middleware to check MongoDB connection
app.use((req, res, next) => {
  if (
    mongoose.connection.readyState !== 1 &&
    req.path.startsWith('/api/') &&
    !canUseAuthFallback(req)
  ) {
    return res.status(503).json({
      message: '🔧 Database Not Connected',
      error: 'MongoDB connection is not established. Please check MONGODB_SETUP.md for setup instructions.',
      setupUrl: 'https://www.mongodb.com/cloud/atlas'
    });
  }
  next();
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/owner-profile', require('./routes/profileRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// error middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  (async () => {
    if (process.env.CONNECT_DB_ON_START === 'true') {
      await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/nykaa-clone');
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await seedDefaultAuthUsers();
      } catch (error) {
        console.error('⚠️ Failed to seed default auth users:', error.message)
      }
    } else {
      console.log('Auth fallback enabled: signup/login will work without MongoDB for this dev session.');
    }

    const startServer = (port, attemptsLeft = 10) => {
      const server = app.listen(port, HOST, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} at http://${HOST}:${port}`);
      });

      server.on('error', (error) => {
        if ((error.code === 'EADDRINUSE' || error.code === 'EPERM') && attemptsLeft > 0) {
          console.warn(`Port ${port} unavailable (${error.code}). Trying ${port + 1}...`);
          startServer(port + 1, attemptsLeft - 1);
          return;
        }

        console.error(`Unable to start server: ${error.message}`);
      });
    };

    startServer(PORT);
  })();
}
