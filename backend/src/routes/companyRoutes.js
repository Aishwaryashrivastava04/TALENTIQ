const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getMyCompany,
  createCompany,
  updateMyCompany,
  updateCompanyById,
  getCompanyById,
} = require('../controllers/companyController');
const { authenticateToken } = require('../middleware/auth');

// Public route to view companies
router.get('/', getAllCompanies);
router.get('/my-company', authenticateToken, getMyCompany);
router.put('/my-company', authenticateToken, updateMyCompany);
router.post('/', authenticateToken, createCompany);
router.put('/:id', authenticateToken, updateCompanyById);
router.get('/:id', getCompanyById);

module.exports = router;
