/**
 * TALENTIQ PREMIUM – Membership & Payment Routes
 */

const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/auth');

// Public Plan Offerings & Dynamic Pricing
router.get('/plans', membershipController.getPlans);

// Authenticated Candidate Subscription Management
router.get('/my-subscription', authenticateToken, membershipController.getMySubscription);
router.post('/create-order', authenticateToken, membershipController.createOrder);
router.post('/verify-payment', authenticateToken, membershipController.verifyPayment);
router.post('/simulate-test-payment', authenticateToken, membershipController.simulateTestPayment);
router.post('/cancel', authenticateToken, membershipController.cancelSubscription);

// Premium AI Career Enablement Tools (Entitlement Protected)
router.post('/ai-mock-interview', authenticateToken, membershipController.getAiMockInterview);
router.post('/ai-resume-review', authenticateToken, membershipController.getAiResumeReview);
router.post('/career-roadmap', authenticateToken, membershipController.getCareerRoadmap);

// Admin-Only Governance & Pricing Controls
router.get('/admin/overview', authenticateToken, membershipController.getAdminOverview);
router.put('/admin/pricing', authenticateToken, membershipController.updateAdminPricing);
router.post('/admin/grant', authenticateToken, membershipController.adminGrantSubscription);

module.exports = router;
