const express = require('express');
const router = express.Router();
const {
  getAllUsers, deleteUser, getAllItems,
  approveItem, rejectItem, getStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes require login + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItems);
router.put('/items/:id/approve', approveItem);
router.delete('/items/:id/reject', rejectItem);

module.exports = router;