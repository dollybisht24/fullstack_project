const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const fallbackUsers = [
  {
    _id: 'fallback-admin',
    name: 'Admin User',
    email: 'admin@nykaa.com',
    password: 'admin123',
    phone: '+91 9876543210',
    isAdmin: true,
  },
  {
    _id: 'fallback-priya',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91 9876543211',
    isAdmin: false,
  },
];

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const getFallbackAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isAdmin: user.isAdmin,
  token: generateToken(user._id),
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!isDatabaseConnected()) {
    const normalizedEmail = email?.toLowerCase();
    const userExists = fallbackUsers.some((user) => user.email === normalizedEmail);

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = {
      _id: `fallback-${Date.now()}`,
      name,
      email: normalizedEmail,
      password,
      phone,
      isAdmin: false,
    };

    fallbackUsers.push(user);
    return res.status(201).json(getFallbackAuthResponse(user));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({ 
    name, 
    email, 
    password, 
    phone,
    verificationToken 
  });

  if (user) {
    // Send verification email
    if (process.env.EMAIL_USER) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Verify Your Nykaa Clone Account',
          html: `<h2>Welcome to Nykaa Clone!</h2>
                 <p>Please verify your email by clicking the link below:</p>
                 <a href="${process.env.CLIENT_URL}/verify/${verificationToken}">Verify Email</a>`,
        });
      } catch (error) {
        console.error('Email send error:', error);
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isDatabaseConnected()) {
    const normalizedEmail = email?.toLowerCase();
    const user = fallbackUsers.find((item) => item.email === normalizedEmail);

    if (user && user.password === password) {
      return res.json(getFallbackAuthResponse(user));
    }

    res.status(401);
    throw new Error('Invalid email or password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log('👤 Fetching profile for user:', req.user._id);
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    console.log('✅ Profile found:', user.email);
    res.json(user);
  } else {
    console.log('❌ User not found');
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.address) {
      user.address = req.body.address;
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      isAdmin: updated.isAdmin,
      token: generateToken(updated._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all users (admin)
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc Delete user (admin)
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Forgot password
// @route POST /api/users/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send reset email
  if (process.env.EMAIL_USER) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `<h2>Reset Your Password</h2>
               <p>Click the link below to reset your password:</p>
               <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>
               <p>This link expires in 1 hour.</p>`,
      });
    } catch (error) {
      console.error('Email send error:', error);
    }
  }

  res.json({ message: 'Password reset email sent' });
});

// @desc Reset password
// @route POST /api/users/reset-password/:token
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

module.exports = { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword
};
