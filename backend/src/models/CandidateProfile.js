const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema(
  {
    candidate_code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    resume_hash: {
      type: String,
      index: true,
      trim: true,
    },
    raw_resume_text: {
      type: String,
      default: '',
    },
    resume_file_meta: {
      original_name: String,
      file_size: Number,
      mime_type: String,
      file_path: String,
      uploaded_at: {
        type: Date,
        default: Date.now,
      },
    },
    extracted_entities: {
      skills: [{ type: String, trim: true }],
      education: [{ type: String, trim: true }],
      experience_tokens: [{ type: String, trim: true }],
      detected_email: String,
      detected_phone: String,
    },
    social_profiles: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
    collection: 'candidate_profiles',
  }
);

CandidateProfileSchema.index({ raw_resume_text: 'text' });
CandidateProfileSchema.index({ 'extracted_entities.detected_email': 1, resume_hash: 1 });

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
