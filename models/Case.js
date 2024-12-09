// case.js
const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseTitle: {
    type: String,
    required: true
  },
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caseOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plaintiff: {
    name: { type: String, required: true },
    identification: { type: String },
    identificationType: { type: String }
  },
  defendant: {
    name: { type: String, required: true },
    identification: { type: String },
    identificationType: { type: String }
  },
  lawyer: {
    name: { type: String, required: true },
    identification: { type: String },
    identificationType: { type: String }
  },
  registrar: {
    name: { type: String, required: true },
    identification: { type: String },
    identificationType: { type: String }
  },
  documents: [{
    documentType: String,
    documentNumber: String,
    executionDate: Date
  }],
  commits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseCommit'
  }],
  chatHistoryAssistanceBot: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatHistory'
  }],
  chatHistoryComplianceBot: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatHistory'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Case', CaseSchema);
