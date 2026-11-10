const express = require('express');
const router = express.Router();
const { getDashboardKPIs, getAuditLogs } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

router.get('/kpis', authenticateToken, getDashboardKPIs);
router.get('/audit-logs', authenticateToken, getAuditLogs);

module.exports = router;
