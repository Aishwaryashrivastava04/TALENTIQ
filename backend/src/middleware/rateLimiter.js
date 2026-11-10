const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter for Authentication Requests (Login, Registration)
 * Prevents brute-force dictionary attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Strict Rate Limiter for Password Reset Requests
 * Prevents email flooding / enumeration attacks
 */
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // limit each IP to 6 reset requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please wait 15 minutes before requesting another reset.',
  },
});

module.exports = {
  authLimiter,
  passwordResetLimiter,
};
