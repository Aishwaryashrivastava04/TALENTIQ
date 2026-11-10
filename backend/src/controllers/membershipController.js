/**
 * TALENTIQ PREMIUM – Membership & Payment Controller
 */

const membershipService = require('../services/membershipService');

// 1. GET /api/membership/plans
async function getPlans(req, res, next) {
  try {
    const data = await membershipService.getPlans();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 2. GET /api/membership/my-subscription
async function getMySubscription(req, res, next) {
  try {
    const userId = req.user?.id || 4; // fallback candidate ID
    const data = await membershipService.getUserSubscription(userId);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 3. POST /api/membership/create-order
async function createOrder(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const { plan_code, billing_cycle } = req.body;
    const orderData = await membershipService.createOrder({
      userId,
      planCode: plan_code,
      billingCycle: billing_cycle,
      userName: req.user?.full_name,
      userEmail: req.user?.email
    });

    return res.status(201).json({
      success: true,
      message: 'Razorpay payment order generated successfully.',
      data: orderData
    });
  } catch (err) {
    next(err);
  }
}

// 4. POST /api/membership/verify-payment
async function verifyPayment(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const { order_id, payment_id, signature, plan_code, billing_cycle } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment parameters: order_id, payment_id, and signature are required.'
      });
    }

    const result = await membershipService.verifyPayment({
      userId,
      orderId: order_id,
      paymentId: payment_id,
      signature,
      planCode: plan_code,
      billingCycle: billing_cycle,
      userName: req.user?.full_name,
      userEmail: req.user?.email
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Payment verification failed.'
    });
  }
}

// 5. POST /api/membership/simulate-test-payment
async function simulateTestPayment(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const { plan_code, billing_cycle, force_fail } = req.body;

    const result = await membershipService.simulateTestPayment({
      userId,
      planCode: plan_code || 'PREMIUM_MONTHLY',
      billingCycle: billing_cycle || 'MONTHLY',
      userName: req.user?.full_name,
      userEmail: req.user?.email,
      forceFail: !!force_fail
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 6. POST /api/membership/cancel
async function cancelSubscription(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const result = await membershipService.cancelSubscription(userId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 7. GET /api/membership/admin/overview (Admin Only)
async function getAdminOverview(req, res, next) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: Only authorized system administrators may view subscription financials.'
      });
    }

    const data = await membershipService.getAdminOverview();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 8. PUT /api/membership/admin/pricing (Admin Only)
async function updateAdminPricing(req, res, next) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: Only authorized system administrators may adjust subscription plan prices.'
      });
    }

    const { monthly_price, yearly_price } = req.body;
    const data = await membershipService.updateAdminPricing({
      monthly_price,
      yearly_price,
      updatedBy: req.user?.full_name || 'Aishwarya Shree (Admin)'
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

// 9. POST /api/membership/admin/grant (Admin Only)
async function adminGrantSubscription(req, res, next) {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted.'
      });
    }

    const { user_id, plan_code, billing_cycle, duration_days, action } = req.body;
    const data = await membershipService.adminGrantSubscription({
      userId: user_id,
      planCode: plan_code,
      billingCycle: billing_cycle,
      durationDays: duration_days,
      action
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 10. POST /api/membership/ai-mock-interview (Premium Only)
async function getAiMockInterview(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const sub = await membershipService.getUserSubscription(userId);

    if (!sub.is_premium && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        requires_premium: true,
        message: 'AI Mock Interview Simulator is reserved for TALENTIQ Premium members. Upgrade your plan to unlock interactive interview coaching.'
      });
    }

    const { role, experience_years, topic } = req.body;
    const data = await membershipService.generateMockInterview({
      role: role || 'Full Stack Developer',
      experienceYears: experience_years || 3,
      targetTopic: topic
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 11. POST /api/membership/ai-resume-review (Premium Only)
async function getAiResumeReview(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const sub = await membershipService.getUserSubscription(userId);

    if (!sub.is_premium && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        requires_premium: true,
        message: 'Advanced AI Resume Review & ATS Keyword Optimization is an exclusive TALENTIQ Premium feature. Upgrade to unlock.'
      });
    }

    const { skills, experience_years, target_role } = req.body;
    const data = await membershipService.generateResumeReview({
      candidateSkills: skills || [],
      experienceYears: experience_years || 3,
      targetRole: target_role || 'Full Stack Developer'
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

// 12. POST /api/membership/career-roadmap (Premium Only)
async function getCareerRoadmap(req, res, next) {
  try {
    const userId = req.user?.id || 4;
    const sub = await membershipService.getUserSubscription(userId);

    if (!sub.is_premium && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        requires_premium: true,
        message: 'Personalized 90-Day Career & Upskilling Roadmap requires TALENTIQ Premium.'
      });
    }

    const { current_role, target_salary_lpa, experience_years } = req.body;
    const data = await membershipService.generateCareerRoadmap({
      currentRole: current_role || 'Full Stack Developer',
      targetSalaryLpa: target_salary_lpa || 16.0,
      experienceYears: experience_years || 3.5
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPlans,
  getMySubscription,
  createOrder,
  verifyPayment,
  simulateTestPayment,
  cancelSubscription,
  getAdminOverview,
  updateAdminPricing,
  adminGrantSubscription,
  getAiMockInterview,
  getAiResumeReview,
  getCareerRoadmap
};
