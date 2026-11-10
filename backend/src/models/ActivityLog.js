const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    user_id: Number,
    user_email: String,
    user_role: String,
    action: {
      type: String,
      required: true,
      index: true,
    },
    entity_type: {
      type: String,
      required: true,
      enum: ['CANDIDATE', 'JOB', 'APPLICATION', 'PREDICTION', 'RESUME', 'AUTH'],
    },
    entity_id: String,
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip_address: String,
    user_agent: String,
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
    collection: 'activity_logs',
  }
);

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
