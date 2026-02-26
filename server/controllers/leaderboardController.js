

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find({ zipCode: req.user.zipCode })
    .select('name badge greenPoints totalCO2Saved')
    .sort({ greenPoints: -1 })
    .limit(10);

  res.json(leaderboard);
});
const getMyImpact = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  const Item = require('../models/Item');
  const giftedCount = await Item.countDocuments({
    owner: req.user._id,
    status: 'Gifted',
  });

  const totalListings = await Item.countDocuments({ owner: req.user._id });

  res.json({
    name: user.name,
    greenPoints: user.greenPoints,
    badge: user.badge,
    totalCO2Saved: user.totalCO2Saved,
    giftedCount,
    totalListings,
    treesEquivalent: Math.round(user.totalCO2Saved / 21), 
    drivingKmAvoided: Math.round(user.totalCO2Saved * 6),
  });
});

module.exports = { getLeaderboard, getMyImpact };