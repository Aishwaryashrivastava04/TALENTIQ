const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, getJobs);
router.get('/:id', authenticateToken, getJobById);
router.post('/', authenticateToken, createJob);
router.put('/:id', authenticateToken, updateJob);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteJob);

module.exports = router;
