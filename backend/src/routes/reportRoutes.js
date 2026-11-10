const express = require('express');
const router = express.Router();
const { exportReport } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

// Allow bearer token or query token
router.get('/export/:type', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
}, exportReport);

module.exports = router;
