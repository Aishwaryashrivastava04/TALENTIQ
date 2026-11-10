const express = require('express');
const router = express.Router();
const {
  getStatisticsSummary,
  getCorrelation,
  getDistribution,
  getExperienceTiers,
  estimateProbability,
  getRecruitmentOverview,
  getDepartmentAnalytics,
  getHiringConversionFunnel,
  getMostDemandedSkills,
  getTimeToHire,
  getModelPerformanceDashboard,
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/statistics-summary', authenticateToken, getStatisticsSummary);
router.get('/correlation', authenticateToken, getCorrelation);
router.get('/distribution', authenticateToken, getDistribution);
router.get('/experience-tiers', authenticateToken, getExperienceTiers);
router.post('/probability', authenticateToken, estimateProbability);
router.get('/overview', authenticateToken, getRecruitmentOverview);
router.get('/departments', authenticateToken, getDepartmentAnalytics);
router.get('/funnel', authenticateToken, getHiringConversionFunnel);
router.get('/demanded-skills', authenticateToken, getMostDemandedSkills);
router.get('/time-to-hire', authenticateToken, getTimeToHire);
router.get('/model-performance', authenticateToken, getModelPerformanceDashboard);

module.exports = router;
