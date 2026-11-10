const express = require('express');
const router = express.Router();
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateCommunications,
  sendCandidateCommunication,
} = require('../controllers/candidateController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, getCandidates);
router.get('/:id', authenticateToken, getCandidateById);
router.post('/', authenticateToken, createCandidate);
router.put('/:id', authenticateToken, updateCandidate);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteCandidate);
router.get('/:id/communications', authenticateToken, getCandidateCommunications);
router.post('/:id/communications', authenticateToken, sendCandidateCommunication);

module.exports = router;
