const asyncHandler = require('express-async-handler');
const OwnerProfile = require('../models/OwnerProfile');

// @desc    Get owner profile
// @route   GET /api/owner-profile
// @access  Public
const getOwnerProfile = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findOne({ isActive: true }).select('-__v');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile);
});

// @desc    Create owner profile (admin only)
// @route   POST /api/owner-profile
// @access  Private/Admin
const createOwnerProfile = asyncHandler(async (req, res) => {
  const {
    name,
    brandName,
    tagline,
    profileImage,
    bannerImage,
    bio,
    statistics,
    skills,
    achievements,
    timeline,
    socialLinks,
    contactInfo
  } = req.body;

  const profileExists = await OwnerProfile.findOne({ isActive: true });

  if (profileExists) {
    res.status(400);
    throw new Error('Active profile already exists. Please update instead.');
  }

  const profile = await OwnerProfile.create({
    name,
    brandName,
    tagline,
    profileImage,
    bannerImage,
    bio,
    statistics,
    skills,
    achievements,
    timeline,
    socialLinks,
    contactInfo
  });

  res.status(201).json(profile);
});

// @desc    Update owner profile (admin only)
// @route   PUT /api/owner-profile/:id
// @access  Private/Admin
const updateOwnerProfile = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findById(req.params.id);

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  const updatedProfile = await OwnerProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedProfile);
});

// @desc    Get profile statistics
// @route   GET /api/owner-profile/stats
// @access  Public
const getProfileStats = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findOne({ isActive: true }).select('statistics');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile.statistics);
});

// @desc    Get skills showcase
// @route   GET /api/owner-profile/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findOne({ isActive: true }).select('skills');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile.skills);
});

// @desc    Get timeline events
// @route   GET /api/owner-profile/timeline
// @access  Public
const getTimeline = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findOne({ isActive: true }).select('timeline');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  // Sort timeline by year (most recent first)
  const sortedTimeline = profile.timeline.sort((a, b) => b.year - a.year);

  res.json(sortedTimeline);
});

// @desc    Get achievements
// @route   GET /api/owner-profile/achievements
// @access  Public
const getAchievements = asyncHandler(async (req, res) => {
  const profile = await OwnerProfile.findOne({ isActive: true }).select('achievements');

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  // Sort achievements by year (most recent first)
  const sortedAchievements = profile.achievements.sort((a, b) => b.year - a.year);

  res.json(sortedAchievements);
});

module.exports = {
  getOwnerProfile,
  createOwnerProfile,
  updateOwnerProfile,
  getProfileStats,
  getSkills,
  getTimeline,
  getAchievements
};
