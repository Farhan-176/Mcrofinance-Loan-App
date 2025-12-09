const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/change-password', authMiddleware, changePassword);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
