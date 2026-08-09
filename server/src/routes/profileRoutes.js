const express = require('express');
const router = express.Router();
const {
  getOwnerProfile,
  createOwnerProfile,
  updateOwnerProfile,
  getProfileStats,
  getSkills,
  getTimeline,
  getAchievements
} = require('../controllers/profileController');

// Public routes
router.get('/', getOwnerProfile);
router.get('/stats', getProfileStats);
router.get('/skills', getSkills);
router.get('/timeline', getTimeline);
router.get('/achievements', getAchievements);

// Admin routes (add authentication middleware in production)
router.post('/', createOwnerProfile);
router.put('/:id', updateOwnerProfile);

module.exports = router;
