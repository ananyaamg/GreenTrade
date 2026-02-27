const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const Item = require('../models/Item');

// ─────────────────────────────────────────────
// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide your email');
  }

  const user = await User.findOne({ email });

  // Always return success even if user not found (security best practice)
  if (!user) {
    return res.json({
      message: 'If this email exists, a reset link has been sent',
    });
  }

  // Generate secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token before saving to DB (security)
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save hashed token + expiry (1 hour) to user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Reset link
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // For now: log to console (replace with email service later)
  console.log('─────────────────────────────────────');
  console.log(`🔑 PASSWORD RESET LINK FOR: ${email}`);
  console.log(resetURL);
  console.log('─────────────────────────────────────');

  res.json({
    message: 'If this email exists, a reset link has been sent',
    // Remove this in production — only for development testing:
    devResetURL: process.env.NODE_ENV === 'development' ? resetURL : undefined,
  });
});

// ─────────────────────────────────────────────
// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
// ─────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Hash the incoming token to compare with DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password (pre-save hook will hash it automatically)
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  res.json({ message: 'Password reset successful. You can now login.' });
});

// ─────────────────────────────────────────────
// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
// ─────────────────────────────────────────────
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error('Please provide your password to confirm deletion');
  }

  // Get user with password
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify password before deleting
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect password');
  }

  // Delete all items owned by this user
  await Item.deleteMany({ owner: req.user._id });

  // Delete the user
  await user.deleteOne();

  res.json({ message: 'Account and all associated data deleted successfully' });
});

module.exports = {
  requestPasswordReset,
  resetPassword,
  deleteAccount,
};