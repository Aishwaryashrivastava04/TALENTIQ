const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  updateApplicationStatus,
  scheduleInterview,
  getInterviews,
  getAllInterviews,
  updateInterview,
} = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getApplications);
router.post('/', authenticateToken, createApplication);
router.patch('/:id/status', authenticateToken, updateApplicationStatus);
router.post('/:id/schedule-interview', authenticateToken, scheduleInterview);
router.get('/:id/interviews', authenticateToken, getInterviews);
router.get('/interviews/all', authenticateToken, getAllInterviews);
router.patch('/interviews/:id', authenticateToken, updateInterview);

module.exports = router;
