const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest users
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  guestId: {
    type: String // For non-logged-in users
  },
  messages: [messageSchema],
  context: {
    userName: String,
    skinType: String,
    concerns: [String],
    preferences: [String]
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
userChatSchema.index({ userId: 1, lastActive: -1 });
userChatSchema.index({ sessionId: 1 });
userChatSchema.index({ guestId: 1 });
userChatSchema.index({ lastActive: -1 });

// Update lastActive on each message
userChatSchema.pre('save', function(next) {
  this.lastActive = Date.now();
  next();
});

const UserChat = mongoose.model('UserChat', userChatSchema);

module.exports = UserChat;
