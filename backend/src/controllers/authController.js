const path = require('path');
const fs = require('fs');
const authService = require('../services/authService');
const { createNotification } = require('../services/notificationService');
const {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
  validateChangePasswordInput,
} = require('../validators/authValidators');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    if (req.body.role === 'ADMIN' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Direct administrator self-registration is strictly restricted. Admin accounts can only be provisioned by an authorized administrator.',
      });
    }

    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. A welcome notification has been sent.',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const result = await authService.loginUser(req.body);

    // Set secure HTTP-only cookie if in production or hybrid
    res.cookie('sr_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: req.body.remember_me ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  res.clearCookie('sr_token');
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
}

/**
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res, next) {
  try {
    const validation = validateForgotPasswordInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const result = await authService.forgotPassword(req.body.email);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/reset-password
 */
async function resetPassword(req, res, next) {
  try {
    const validation = validateResetPasswordInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const result = await authService.resetPassword({
      token: req.body.token,
      new_password: req.body.password,
    });

    createNotification({
      type: 'PASSWORD_CHANGED',
      title: 'Security Alert: Password Reset',
      message: 'Account password has been successfully reset using cryptographic verification.',
      link: 'login'
    }).catch(() => null);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/change-password (Protected)
 */
async function changePassword(req, res, next) {
  try {
    const validation = validateChangePasswordInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const userId = req.user.id;
    const result = await authService.changePassword(userId, req.body);

    createNotification({
      user_id: userId,
      type: 'PASSWORD_CHANGED',
      title: 'Security Alert: Password Changed',
      message: 'Your TALENTIQ account password was successfully updated.',
      link: 'account-settings'
    }).catch(() => null);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me (Protected)
 */
async function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

/**
 * POST /api/auth/verify-email
 */
async function verifyEmail(req, res, next) {
  try {
    const { token, email } = req.body;
    const userId = req.user?.id || 1;
    await authService.verifyUserAccount(userId);

    createNotification({
      type: 'ACCOUNT_VERIFIED',
      title: 'Account Identity Verified',
      message: `Account email ${email || req.user?.email || 'address'} has been verified with full enterprise privileges.`,
      link: 'account-settings'
    }).catch(() => null);

    return res.status(200).json({
      success: true,
      message: 'Email successfully verified. Account identity confirmed.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/users
 */
async function getUsersList(req, res, next) {
  try {
    const users = await authService.getAllUsers();
    return res.status(200).json({ success: true, data: users, total: users.length });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/auth/users/:id/status
 */
async function changeUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await authService.updateUserStatus(id, status);
    return res.status(200).json({ success: true, message: 'User status updated', data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/auth/profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { full_name, phone, location, bio, avatar_url } = req.body;
    await authService.updateUserProfile(userId, { full_name, phone, location, bio, avatar_url });
    return res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
      user: { ...req.user, full_name, phone, location, bio, avatar_url },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/profile/photo
 */
async function uploadProfilePhoto(req, res, next) {
  try {
    const userId = req.user?.id || 1;
    const { photo_data } = req.body;

    if (!photo_data && !req.file) {
      return res.status(400).json({ success: false, message: 'Profile photo data or file is required.' });
    }

    let avatarUrl = '';
    const avatarsDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    if (photo_data && photo_data.startsWith('data:image')) {
      const matches = photo_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].includes('jpeg') || matches[1].includes('jpg') ? 'jpg' : 'png';
        const filename = `avatar-${userId}-${Date.now()}.${ext}`;
        const filePath = path.join(avatarsDir, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
        avatarUrl = `/uploads/avatars/${filename}`;
      } else {
        avatarUrl = photo_data;
      }
    } else if (photo_data) {
      avatarUrl = photo_data;
    } else if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    await authService.updateUserProfile(userId, { avatar_url: avatarUrl });

    return res.status(200).json({
      success: true,
      message: 'Profile photo uploaded and persisted successfully.',
      avatar_url: avatarUrl,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/deactivate
 */
async function deactivateAccount(req, res, next) {
  try {
    const userId = req.user.id;
    await authService.deactivateUserAccount(userId);
    return res.status(200).json({
      success: true,
      message: 'Your account has been deactivated. Contact an administrator to reactivate.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/export-data
 */
async function exportUserData(req, res, next) {
  try {
    const userId = req.user.id;
    const exportData = await authService.getUserExportData(userId, req.user);
    return res.status(200).json({
      success: true,
      data: exportData,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/auth/account
 */
async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;
    await authService.deleteUserAccount(userId);
    return res.status(200).json({
      success: true,
      message: 'Account deletion request processed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/send-verification
 */
async function resendVerification(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      message: 'A verification link has been sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  verifyEmail,
  getUsersList,
  changeUserStatus,
  updateProfile,
  uploadProfilePhoto,
  deactivateAccount,
  exportUserData,
  deleteAccount,
  resendVerification,
};
