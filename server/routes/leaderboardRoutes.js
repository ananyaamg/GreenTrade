const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyImpact } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLeaderboard);
router.get('/my-impact', protect, getMyImpact);

module.exports = router;