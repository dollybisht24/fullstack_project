const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  year: Number,
  organization: String,
  type: {
    type: String,
    enum: ['certificate', 'award', 'achievement', 'milestone'],
    default: 'achievement'
  },
  image: String
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert', 'master'],
    default: 'expert'
  },
  category: String,
  icon: String
});

const timelineEventSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  type: {
    type: String,
    enum: ['milestone', 'certification', 'award', 'event', 'collaboration'],
    default: 'milestone'
  }
});

const ownerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Meenakshi'
  },
  brandName: {
    type: String,
    required: true,
    default: 'Meenakshi_Makeover'
  },
  tagline: {
    type: String,
    default: 'Transforming Beauty, One Face at a Time'
  },
  profileImage: {
    type: String,
    default: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  bannerImage: {
    type: String,
    default: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  bio: {
    journey: {
      type: String,
      default: 'Started as a passionate makeup enthusiast and evolved into a professional makeup artist serving thousands of clients.'
    },
    training: {
      type: String,
      default: 'Trained at prestigious makeup academies with certifications in HD Makeup, Airbrush Techniques, and Bridal Artistry.'
    },
    experience: {
      type: String,
      default: 'Over 10+ years of experience in bridal makeup, celebrity styling, and fashion shows.'
    },
    vision: {
      type: String,
      default: 'Empowering every individual to feel confident and beautiful through personalized beauty solutions.'
    }
  },
  statistics: {
    totalClients: {
      type: Number,
      default: 10000
    },
    averageRating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 8500
    },
    yearsOfExperience: {
      type: Number,
      default: 10
    },
    certificationsCount: {
      type: Number,
      default: 15
    }
  },
  skills: [skillSchema],
  achievements: [achievementSchema],
  timeline: [timelineEventSchema],
  socialLinks: {
    instagram: String,
    facebook: String,
    youtube: String,
    twitter: String,
    linkedin: String
  },
  contactInfo: {
    email: String,
    phone: String,
    location: String
  },
  featured: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
ownerProfileSchema.index({ brandName: 1 });
ownerProfileSchema.index({ featured: 1, isActive: 1 });

const OwnerProfile = mongoose.model('OwnerProfile', ownerProfileSchema);

module.exports = OwnerProfile;
