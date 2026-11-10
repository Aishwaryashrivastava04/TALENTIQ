/**
 * Professional HTML Email Templates for SmartRecruit Platform
 * Responsive, inline CSS, Executive Navy Blue & Purple SaaS Theme
 */

function baseEmailWrapper(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F19; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F8FAFC;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0B0F19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #141E33; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 35px 40px; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="width: 44px; height: 44px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; text-align: center; vertical-align: middle; color: #FFFFFF; font-size: 22px; font-weight: bold;">
                    ✦
                  </td>
                  <td style="padding-left: 14px; text-align: left;">
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                      SmartRecruit<span style="color: #818CF8;">AI</span>
                    </div>
                    <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                      Enterprise Recruitment & Analytics
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; background-color: #0F172A; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; font-size: 12px; color: #64748B; line-height: 1.6;">
              <p style="margin: 0 0 8px;">This is a system-generated message from the Smart Recruitment Platform.</p>
              <p style="margin: 0;">© 2026 SmartRecruitAI Inc. All rights reserved. • Four-Subject Integrated MCA Project</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. Forgot Password Reset Request Email
 */
function getForgotPasswordTemplate(fullName, resetUrl, expiresInMinutes = 15) {
  const content = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #FFFFFF;">
      Password Reset Request
    </h1>
    <p style="margin: 0 0 20px; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
      Hello <strong>${fullName || 'User'}</strong>,
    </p>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      We received a request to reset the password for your SmartRecruit account. Click the secure button below to choose a new password. This link is cryptographically signed and will expire in <strong style="color: #F8FAFC;">${expiresInMinutes} minutes</strong>.
    </p>

    <!-- Call to action button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
      <tr>
        <td style="border-radius: 8px; background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); text-align: center;">
          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 8px;">
            Reset Your Password →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 12px; font-size: 13px; color: #64748B; line-height: 1.5;">
      If the button above does not work, copy and paste this link into your browser:
    </p>
    <div style="background-color: #0F172A; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #818CF8; word-break: break-all; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 25px;">
      ${resetUrl}
    </div>

    <div style="padding: 14px 18px; background-color: rgba(245, 158, 11, 0.1); border-left: 3px solid #F59E0B; border-radius: 4px; font-size: 12px; color: #FCD34D; line-height: 1.5;">
      <strong>Security notice:</strong> If you did not request this password reset, please ignore this email or contact security. Your password will remain unchanged.
    </div>
  `;
  return baseEmailWrapper('Password Reset Request', content);
}

/**
 * 2. Password Changed Confirmation Email
 */
function getPasswordChangedTemplate(fullName, changedAt = new Date().toUTCString()) {
  const content = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #FFFFFF;">
      Password Successfully Updated
    </h1>
    <p style="margin: 0 0 16px; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
      Hello <strong>${fullName || 'User'}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      This email confirms that the password for your account has been successfully changed on <strong>${changedAt}</strong>.
    </p>

    <div style="padding: 16px 20px; background-color: rgba(16, 185, 129, 0.1); border-left: 3px solid #10B981; border-radius: 6px; margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 700; color: #34D399; margin-bottom: 4px;">
        ✓ Action Completed
      </div>
      <div style="font-size: 13px; color: #A7F3D0; line-height: 1.5;">
        You can now sign in using your new password. All prior password reset tokens have been invalidated.
      </div>
    </div>

    <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.5;">
      If you did not perform this change, your account may have been compromised. Please contact system administrators immediately.
    </p>
  `;
  return baseEmailWrapper('Password Updated', content);
}

/**
 * 3. Welcome Email
 */
function getWelcomeTemplate(fullName, role, loginUrl) {
  const content = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #FFFFFF;">
      Welcome to SmartRecruit AI!
    </h1>
    <p style="margin: 0 0 16px; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
      Hello <strong>${fullName}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Your account has been created with the role of <strong style="color: #818CF8;">${role}</strong>. 
      You now have access to our AI-powered recruitment management, machine learning compensation prediction, and statistical analytics suite.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px 0;">
      <tr>
        <td style="border-radius: 8px; background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);">
          <a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 8px;">
            Go to Your Dashboard →
          </a>
        </td>
      </tr>
    </table>
  `;
  return baseEmailWrapper('Welcome to SmartRecruit', content);
}

/**
 * 4. Email Verification Template
 */
function getVerificationTemplate(fullName, verifyUrl) {
  const content = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #FFFFFF;">
      Verify Your Email Address
    </h1>
    <p style="margin: 0 0 16px; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
      Hello <strong>${fullName}</strong>,
    </p>
    <p style="margin: 0 0 24px; font-size: 14px; color: #94A3B8; line-height: 1.6;">
      Thank you for registering. Please click the button below to verify your email address and activate your recruitment profile.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px 0;">
      <tr>
        <td style="border-radius: 8px; background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
          <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 8px;">
            Verify Email Address ✓
          </a>
        </td>
      </tr>
    </table>
  `;
  return baseEmailWrapper('Verify Email', content);
}

module.exports = {
  getForgotPasswordTemplate,
  getPasswordChangedTemplate,
  getWelcomeTemplate,
  getVerificationTemplate,
};
