const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Item = require('../models/Item');


// ─────────────────────────────────────────────
// GET ALL USERS
// ─────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });

  res.json(users);

});


// ─────────────────────────────────────────────
// DELETE USER
// ─────────────────────────────────────────────
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

  await Item.deleteMany({
    owner: req.params.id
  });

  res.json({
    message: 'User and their items deleted successfully'
  });

});


// ─────────────────────────────────────────────
// GET ALL ITEMS (ADMIN)
// ─────────────────────────────────────────────
const getAllItems = asyncHandler(async (req, res) => {

  const items = await Item.find({})
    .populate('owner', 'name email zipCode')
    .sort({ createdAt: -1 });

  res.json(items);

});


// ─────────────────────────────────────────────
// APPROVE ITEM
// ─────────────────────────────────────────────
const approveItem = asyncHandler(async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  item.isApproved = true;

  await item.save();

  res.json({
    message: 'Item approved',
    item
  });

});


// ─────────────────────────────────────────────
// REJECT ITEM
// ─────────────────────────────────────────────
const rejectItem = asyncHandler(async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  await item.deleteOne();

  res.json({
    message: 'Item rejected and deleted'
  });

});


// ─────────────────────────────────────────────
// ADMIN DASHBOARD STATS
// ─────────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {

  const totalUsers =
    await User.countDocuments({
      isAdmin: false
    });

  const totalItems =
    await Item.countDocuments();

  const pendingItems =
    await Item.countDocuments({
      isApproved: false
    });

  const approvedItems =
    await Item.countDocuments({
      isApproved: true
    });

  const giftedItems =
    await Item.countDocuments({
      status: 'Gifted'
    });

  res.json({
    totalUsers,
    totalItems,
    pendingItems,
    approvedItems,
    giftedItems
  });

});


// ─────────────────────────────────────────────
// GET ADMIN ZIP CODES
// GET /api/admin/zipcodes
// ─────────────────────────────────────────────
const getAdminZipCodes = asyncHandler(async (req, res) => {

  const admin =
    await User.findById(req.user._id)
      .select('adminZipCodes zipCode');

  res.json({

    adminZipCodes:
      admin.adminZipCodes || [],

    myZipCode:
      admin.zipCode

  });

});


// ─────────────────────────────────────────────
// UPDATE ADMIN ZIP CODES
// PUT /api/admin/zipcodes
// ─────────────────────────────────────────────
const updateAdminZipCodes = asyncHandler(async (req, res) => {

  const {
    adminZipCodes
  } = req.body;


  if (!Array.isArray(adminZipCodes)) {

    res.status(400);

    throw new Error(
      'adminZipCodes must be an array'
    );

  }


  const cleaned = [

    ...new Set(

      adminZipCodes

        .map(
          z =>
            z.toString().trim()
        )

        .filter(
          z =>
            z.length > 0
        )

    )

  ];


  const admin =
    await User.findByIdAndUpdate(

      req.user._id,

      {
        adminZipCodes: cleaned
      },

      {
        new: true
      }

    )

    .select('adminZipCodes');


  res.json({

    message:
      cleaned.length === 0
        ? 'Viewing ALL zip codes'
        : `Now viewing ${cleaned.length} zip code(s)`,

    adminZipCodes:
      admin.adminZipCodes

  });

});


// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
module.exports = {

  getAllUsers,
  deleteUser,
  getAllItems,
  approveItem,
  rejectItem,
  getStats,

  // NEW
  getAdminZipCodes,
  updateAdminZipCodes

};