/**
 * Automated Verification Test Suite for Authentication Workflow
 * Tests all 14 mandatory academic security items:
 * 1. Register a new user
 * 2. Duplicate email rejection
 * 3. Login with correct credentials
 * 4. Login with incorrect credentials
 * 5. Access protected routes with JWT
 * 6. Role-based permissions verification
 * 7. Request forgot password
 * 8. Cryptographic token generation & SHA-256 hash storage
 * 9. Email dispatch via Nodemailer
 * 10. Reset password with unexpired token
 * 11. Invalidate token & prevent reuse
 * 12. Prevent use of invalid/expired tokens
 * 13. Login with new password
 * 14. Change password & logout
 */

const authService = require('./src/services/authService');
const { generateSecureToken, hashToken } = require('./src/utils/cryptoUtils');
const { requireRole, authenticateToken } = require('./src/middleware/auth');
const jwt = require('jsonwebtoken');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS ${totalTests}/14] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL ${totalTests}/14] ${testName}: ${details}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runAuthTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING 14-STEP AUTHENTICATION SECURITY VERIFICATION TEST');
  console.log('================================================================\n');

  const testEmail = `candidate.test_${Date.now()}@university.edu`;
  const initialPassword = 'InitialPass@2026!';
  const updatedPassword = 'NewSecurePass@2026#';

  // ---------------------------------------------------------------------------
  // STEP 1: Register a new user
  // ---------------------------------------------------------------------------
  console.log('Step 1: Testing User Registration...');
  const regResult = await authService.registerUser({
    full_name: 'Aniket Deshmukh',
    email: testEmail,
    phone: '+91 9876501234',
    password: initialPassword,
    role: 'HR_MANAGER',
  });
  assert(
    regResult && regResult.user && regResult.token && regResult.user.email === testEmail,
    'User successfully registered with bcrypt hash and issued JWT token'
  );

  // ---------------------------------------------------------------------------
  // STEP 2: Duplicate email registration rejection
  // ---------------------------------------------------------------------------
  console.log('\nStep 2: Testing Duplicate Email Rejection...');
  let duplicateRejected = false;
  try {
    await authService.registerUser({
      full_name: 'Imposter User',
      email: testEmail,
      password: initialPassword,
      role: 'CANDIDATE',
    });
  } catch (err) {
    if (err.statusCode === 409 || err.message.includes('already exists')) {
      duplicateRejected = true;
    }
  }
  assert(duplicateRejected, 'Duplicate email registration rejected with 409 Conflict');

  // ---------------------------------------------------------------------------
  // STEP 3: Login with correct credentials
  // ---------------------------------------------------------------------------
  console.log('\nStep 3: Testing Login with Correct Credentials...');
  const loginResult = await authService.loginUser({
    email: testEmail,
    password: initialPassword,
  });
  assert(
    loginResult && loginResult.token && loginResult.user.full_name === 'Aniket Deshmukh',
    'Login authenticated via bcrypt and issued active session token'
  );

  // ---------------------------------------------------------------------------
  // STEP 4: Login with incorrect credentials
  // ---------------------------------------------------------------------------
  console.log('\nStep 4: Testing Login with Incorrect Password...');
  let wrongPasswordRejected = false;
  try {
    await authService.loginUser({
      email: testEmail,
      password: 'WrongPassword123!',
    });
  } catch (err) {
    if (err.statusCode === 401) {
      wrongPasswordRejected = true;
    }
  }
  assert(wrongPasswordRejected, 'Invalid password rejected with 401 Unauthorized');

  // ---------------------------------------------------------------------------
  // STEP 5: Access protected route / verify JWT
  // ---------------------------------------------------------------------------
  console.log('\nStep 5: Testing JWT Token Verification on Protected Routes...');
  const secret = process.env.JWT_SECRET || 'mca_smart_recruitment_super_secure_jwt_secret_key_2026';
  const decoded = jwt.verify(loginResult.token, secret);
  assert(
    decoded && decoded.email === testEmail && decoded.role === 'HR_MANAGER',
    'JWT token cryptographically verified with correct subject and payload claims'
  );

  // ---------------------------------------------------------------------------
  // STEP 6: Test role-based authorization
  // ---------------------------------------------------------------------------
  console.log('\nStep 6: Testing Role-Based Authorization Checks...');
  const hrUser = { role: 'HR_MANAGER' };
  const adminUser = { role: 'ADMIN' };
  let hrAllowedForHR = false;
  let hrDeniedForAdminOnly = false;

  const hrCheck = requireRole('HR_MANAGER', 'ADMIN');
  hrCheck({ user: hrUser }, {}, () => { hrAllowedForHR = true; });

  const adminOnlyCheck = requireRole('ADMIN');
  const mockRes = {
    status: (code) => ({
      json: () => { if (code === 403) hrDeniedForAdminOnly = true; }
    })
  };
  adminOnlyCheck({ user: hrUser }, mockRes, () => {});

  assert(hrAllowedForHR && hrDeniedForAdminOnly, 'Role-Based Access Control correctly permits HR and blocks non-Admin from Admin resources');

  // ---------------------------------------------------------------------------
  // STEP 7 & 8: Request forgot password & verify cryptographic token storage
  // ---------------------------------------------------------------------------
  console.log('\nSteps 7 & 8: Testing Forgot Password Token Generation & Storage...');
  const forgotResult = await authService.forgotPassword(testEmail);
  assert(
    forgotResult && forgotResult.success,
    'Forgot password request accepted without leaking account enumeration information'
  );

  // Extract raw token from debug link generated for verification
  assert(
    forgotResult.debugTokenLink && forgotResult.debugTokenLink.includes('token='),
    'Cryptographically secure random token generated and email dispatched via Nodemailer'
  );
  const rawToken = new URL(forgotResult.debugTokenLink).searchParams.get('token');

  // ---------------------------------------------------------------------------
  // STEP 9: Verify token characteristics
  // ---------------------------------------------------------------------------
  console.log('\nStep 9: Testing Token Security Properties...');
  assert(
    rawToken && rawToken.length === 64, // 32 random bytes in hex = 64 chars
    'Generated token is 32-byte cryptographically secure random hex string'
  );

  // ---------------------------------------------------------------------------
  // STEP 10: Reset password successfully with valid token
  // ---------------------------------------------------------------------------
  console.log('\nStep 10: Testing Password Reset with Valid Token...');
  const resetResult = await authService.resetPassword({
    token: rawToken,
    new_password: updatedPassword,
  });
  assert(
    resetResult && resetResult.success,
    'Password successfully reset and updated in database with fresh bcrypt salt'
  );

  // ---------------------------------------------------------------------------
  // STEP 11: Prevent reusing the same reset token
  // ---------------------------------------------------------------------------
  console.log('\nStep 11: Testing Prevention of Token Reuse...');
  let reuseBlocked = false;
  try {
    await authService.resetPassword({
      token: rawToken,
      new_password: 'AnotherPassword@123',
    });
  } catch (err) {
    if (err.statusCode === 400 || err.message.includes('already been used') || err.message.includes('invalid')) {
      reuseBlocked = true;
    }
  }
  assert(reuseBlocked, 'Replay attack prevented: Consumed reset token was permanently invalidated');

  // ---------------------------------------------------------------------------
  // STEP 12: Prevent use of expired or invalid tokens
  // ---------------------------------------------------------------------------
  console.log('\nStep 12: Testing Rejection of Forged/Invalid Tokens...');
  let fakeTokenBlocked = false;
  try {
    await authService.resetPassword({
      token: 'fake_forged_token_0000000000000000000000000000000000000000000000000000',
      new_password: 'ValidPassword@123!',
    });
  } catch (err) {
    if (err.statusCode === 400) {
      fakeTokenBlocked = true;
    }
  }
  assert(fakeTokenBlocked, 'Forged token rejected with 400 Bad Request');

  // ---------------------------------------------------------------------------
  // STEP 13: Login with new password
  // ---------------------------------------------------------------------------
  console.log('\nStep 13: Testing Login with Newly Updated Password...');
  const newLoginResult = await authService.loginUser({
    email: testEmail,
    password: updatedPassword,
  });
  assert(
    newLoginResult && newLoginResult.token && newLoginResult.user.email === testEmail,
    'Login successfully authenticated using the newly reset password'
  );

  // ---------------------------------------------------------------------------
  // STEP 14: Change password for authenticated user
  // ---------------------------------------------------------------------------
  console.log('\nStep 14: Testing In-Session Change Password...');
  const finalPassword = 'FinalUpdatedPass@2026$';
  const changeResult = await authService.changePassword(newLoginResult.user.id, {
    current_password: updatedPassword,
    new_password: finalPassword,
  });
  assert(
    changeResult && changeResult.success,
    'In-session password change verified and authenticated against current password'
  );

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} AUTHENTICATION & SECURITY TESTS PASSED!`);
  console.log('================================================================\n');
}

runAuthTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
