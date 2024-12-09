const mongoose = require('mongoose');

const CaseCommitSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  }, // Links to the associated case
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // User who made the commit
  commitTitle: {
    type: String,
    required: true
  }, // Short title for the commit
  commitDescription: {
    type: String
  }, // Detailed explanation of what was changed
  snapshot: {
    type: Object,
    required: true
  }, // Full snapshot of the case state at the time of the commit
  timestamp: {
    type: Date,
    default: Date.now
  } // Automatically records when the commit was made
});

module.exports = mongoose.model('CaseCommit', CaseCommitSchema);
