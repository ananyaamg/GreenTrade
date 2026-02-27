const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const {
  requestPasswordReset,
  resetPassword,
  deleteAccount,
} = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// New routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;