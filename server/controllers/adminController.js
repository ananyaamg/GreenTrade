const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Item = require('../models/Item');

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }
  await user.deleteOne();
  // Delete all items by this user
  await Item.deleteMany({ owner: req.params.id });
  res.json({ message: 'User and their items deleted successfully' });
});

// Get all items (including unapproved)
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find({})
    .populate('owner', 'name email zipCode')
    .sort({ createdAt: -1 });
  res.json(items);
});

// Approve an item
const approveItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  item.isApproved = true;
  await item.save();
  res.json({ message: 'Item approved', item });
});

// Reject/delete an item
const rejectItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  await item.deleteOne();
  res.json({ message: 'Item rejected and deleted' });
});

// Get admin dashboard stats
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isAdmin: false });
  const totalItems = await Item.countDocuments();
  const pendingItems = await Item.countDocuments({ isApproved: false });
  const approvedItems = await Item.countDocuments({ isApproved: true });
  const giftedItems = await Item.countDocuments({ status: 'Gifted' });
  res.json({ totalUsers, totalItems, pendingItems, approvedItems, giftedItems });
});

module.exports = { getAllUsers, deleteUser, getAllItems, approveItem, rejectItem, getStats };