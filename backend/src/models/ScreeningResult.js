const mongoose = require('mongoose');

const ScreeningResultSchema = new mongoose.Schema(
  {
    screening_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    candidate_code: {
      type: String,
      required: true,
      index: true,
    },
    job_code: {
      type: String,
      required: true,
      index: true,
    },
    candidate_name: String,
    job_title: String,
    match_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matched_skills: [{ type: String, trim: true }],
    missing_skills: [{ type: String, trim: true }],
    experience_analysis: {
      candidate_years: Number,
      job_min_years: Number,
      job_max_years: Number,
      experience_fit: {
        type: String,
        enum: ['UNDER_QUALIFIED', 'OPTIMAL_FIT', 'OVER_QUALIFIED'],
      },
    },
    explainable_summary: {
      type: String,
      required: true,
    },
    screened_by: {
      type: String,
      default: 'AI_RECRUITMENT_ENGINE',
    },
  },
  {
    timestamps: true,
    collection: 'screening_results',
  }
);

module.exports = mongoose.model('ScreeningResult', ScreeningResultSchema);
