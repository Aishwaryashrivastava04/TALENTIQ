const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  predictSalary,
  getModelMetrics,
  parseResume,
  matchCandidateJob,
  rankCandidates,
  analyzeSkillGaps,
  generateInterviewQuestions,
  recommendCareerRoles,
  getSalaryBenchmarks,
  checkDuplicateResume,
} = require('../controllers/mlController');
const { authenticateToken } = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and plain text resume files are supported.'));
    }
  },
});

const uploadSingleOrAny = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post('/predict-salary', authenticateToken, predictSalary);
router.get('/metrics', authenticateToken, getModelMetrics);
router.post('/parse-resume', authenticateToken, uploadSingleOrAny, parseResume);
router.post('/match-candidate', authenticateToken, matchCandidateJob);
router.post('/rank-candidates', authenticateToken, rankCandidates);
router.post('/analyze-skill-gaps', authenticateToken, analyzeSkillGaps);
router.post('/generate-interview-questions', authenticateToken, generateInterviewQuestions);
router.post('/recommend-career-roles', authenticateToken, recommendCareerRoles);
router.post('/salary-benchmarks', authenticateToken, getSalaryBenchmarks);
router.post('/check-duplicate-resume', authenticateToken, checkDuplicateResume);

module.exports = router;
