const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  verifyEmail,
  getUsersList,
  changeUserStatus,
  updateProfile,
  uploadProfilePhoto,
  deactivateAccount,
  exportUserData,
  deleteAccount,
  resendVerification,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

// Public Authentication Routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);
router.post('/verify-email', verifyEmail);

// User Management Routes (Admin & Authed)
router.get('/users', getUsersList);
router.patch('/users/:id/status', changeUserStatus);
router.post('/users', register);

// Protected Authentication & Profile Settings Routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/photo', authenticateToken, uploadProfilePhoto);
router.post('/deactivate', authenticateToken, deactivateAccount);
router.post('/change-password', authenticateToken, changePassword);
router.get('/export-data', authenticateToken, exportUserData);
router.delete('/account', authenticateToken, deleteAccount);
router.post('/send-verification', authenticateToken, resendVerification);

module.exports = router;
