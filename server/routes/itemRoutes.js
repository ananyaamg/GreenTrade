

const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/public', async (req, res) => {
  try {
    const items = await require('../models/Item')
      .find({ isApproved: true, status: 'Available' })
      .populate('owner', 'name badge')
      .sort({ createdAt: -1 })
      .limit(8);

    const users = await require('../models/User').countDocuments();
    const co2 = await require('../models/Item').aggregate([
      { $match: { status: 'Gifted' } },
      { $group: { _id: null, total: { $sum: '$estimatedCO2Saved' } } }
    ]);

    res.json({
      items,
      stats: {
        items: await require('../models/Item').countDocuments({ isApproved: true }),
        users,
        co2: co2[0]?.total || 0
      }
    });
  } catch (err) {
    res.json({ items: [], stats: { items: 0, users: 0, co2: 0 } });
  }
});
router.get('/my-items', protect, getMyItems);

router.route('/')
  .get(protect, getItems)
  .post(protect, upload.single('image'), createItem);

router.route('/:id')
  .get(protect, getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

module.exports = router;