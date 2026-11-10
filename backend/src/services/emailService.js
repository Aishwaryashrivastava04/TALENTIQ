const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const {
  getForgotPasswordTemplate,
  getPasswordChangedTemplate,
  getWelcomeTemplate,
  getVerificationTemplate,
} = require('../templates/emailTemplates');

dotenv.config();

let transporter = null;
let isEtherealTestMode = false;

/**
 * Initializes and caches Nodemailer transporter
 */
async function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If real SMTP credentials provided, use them
  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    isEtherealTestMode = false;
    console.log(`📧 [Nodemailer] Configured SMTP Transporter (${host}:${port}, User: ${user})`);
  } else {
    // Generate automated test ethereal account for zero-configuration testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEtherealTestMode = true;
      console.log('📧 [Nodemailer] Using Ethereal Test SMTP (Simulated Delivery with Live Previews):', testAccount.user);
    } catch (e) {
      console.warn('⚠️ [Nodemailer] Could not create test SMTP account, using JSON transport fallback:', e.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      isEtherealTestMode = true;
    }
  }

  return transporter;
}

/**
 * Verifies SMTP connection health
 */
async function verifySMTPConnection() {
  try {
    const t = await getTransporter();
    if (t.verify) {
      await t.verify();
      console.log('✅ [Nodemailer] SMTP Connection established and ready to send messages.');
      return true;
    }
    return true;
  } catch (error) {
    console.warn('⚠️ [Nodemailer Warning] SMTP verification failed:', error.message);
    return false;
  }
}

/**
 * Sends Password Reset Email with secure link
 */
async function sendPasswordResetEmail(toEmail, fullName, rawToken) {
  const t = await getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
  const fromAddress = process.env.EMAIL_FROM || '"SmartRecruit Security" <security@smartrecruit.ai>';

  const htmlContent = getForgotPasswordTemplate(fullName, resetUrl, 15);

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: 'Action Required: Reset Your SmartRecruit Password',
    text: `Hello ${fullName},\n\nPlease reset your password using this link (expires in 15 minutes):\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    html: htmlContent,
  };

  const info = await t.sendMail(mailOptions);
  let previewUrl = null;
  if (isEtherealTestMode && nodemailer.getTestMessageUrl) {
    previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`🔗 [Email Preview URL]: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
    isEtherealTestMode,
    resetUrl,
  };
}

/**
 * Sends Confirmation when Password has changed
 */
async function sendPasswordChangedEmail(toEmail, fullName) {
  const t = await getTransporter();
  const fromAddress = process.env.EMAIL_FROM || '"SmartRecruit Security" <security@smartrecruit.ai>';
  const htmlContent = getPasswordChangedTemplate(fullName, new Date().toUTCString());

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: 'Security Alert: Your SmartRecruit Password Was Changed',
    text: `Hello ${fullName},\n\nYour password has been successfully updated on ${new Date().toUTCString()}.\nIf you did not make this change, please contact administration immediately.`,
    html: htmlContent,
  };

  const info = await t.sendMail(mailOptions);
  let previewUrl = null;
  if (isEtherealTestMode && nodemailer.getTestMessageUrl) {
    previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`🔗 [Email Preview URL]: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
  };
}

/**
 * Sends Welcome Email upon registration
 */
async function sendWelcomeEmail(toEmail, fullName, role) {
  const t = await getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const loginUrl = `${frontendUrl}/login`;
  const fromAddress = process.env.EMAIL_FROM || '"SmartRecruit Team" <welcome@smartrecruit.ai>';
  const htmlContent = getWelcomeTemplate(fullName, role, loginUrl);

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: 'Welcome to SmartRecruit AI Platform',
    text: `Hello ${fullName},\n\nWelcome to SmartRecruit AI! Your account has been created with role: ${role}.\nSign in at: ${loginUrl}`,
    html: htmlContent,
  };

  const info = await t.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

/**
 * Sends Email Verification Link
 */
async function sendVerificationEmail(toEmail, fullName, rawToken) {
  const t = await getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyUrl = `${frontendUrl}/verify-email?token=${rawToken}`;
  const fromAddress = process.env.EMAIL_FROM || '"SmartRecruit Verification" <verify@smartrecruit.ai>';
  const htmlContent = getVerificationTemplate(fullName, verifyUrl);

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: 'Verify Your Email Address - SmartRecruit AI',
    text: `Hello ${fullName},\n\nPlease verify your email by clicking: ${verifyUrl}`,
    html: htmlContent,
  };

  const info = await t.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, verifyUrl };
}

module.exports = {
  getTransporter,
  verifySMTPConnection,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
};
