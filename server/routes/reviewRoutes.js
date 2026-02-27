const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getItemReviews,
  canReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/user/:userId', protect, getUserReviews);
router.get('/item/:itemId', protect, getItemReviews);
router.get('/can-review/:itemId', protect, canReview);

module.exports = router;
