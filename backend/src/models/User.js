const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'HR_MANAGER', 'CANDIDATE', 'RECRUITER'],
      default: 'CANDIDATE',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_verified: {
      type: Boolean,
      default: true,
    },
    company_name: {
      type: String,
      default: null,
    },
    job_title: {
      type: String,
      default: null,
    },
    avatar_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Graceful model registration
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
