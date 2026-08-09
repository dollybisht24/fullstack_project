const express = require('express');
const router = express.Router();
const { addReview, getReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:productId').get(getReviews).post(protect, addReview);
router.route('/:productId/:reviewId').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
