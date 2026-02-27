const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllItems,
  approveItem,
  rejectItem,
  getStats,
  getAdminZipCodes,
  updateAdminZipCodes,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes protected
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItems);
router.put('/items/:id/approve', approveItem);
router.delete('/items/:id/reject', rejectItem);

// New zip code routes
router.get('/zipcodes', getAdminZipCodes);
router.put('/zipcodes', updateAdminZipCodes);

module.exports = router;