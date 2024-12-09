const mongoose = require('mongoose');

const CaseNoteSchema = new mongoose.Schema({
  case: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Case', 
    required: true 
  }, // Links the note to a specific case
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // User who created the note
  citations: [String], // Array of legal citations
  facts: [String], // Key facts related to the case
  statutes: {
    acts: [String], // Relevant acts
    sections: [String], // Applicable sections
    articles: [String] // Related constitutional articles
  },
  precedents: [String], // Array of relevant case precedents
  ratio: [String], // Rationale or principles behind decisions
  rulings: [String], // Judicial rulings or conclusions
  context: { 
    type: String 
  }, // Additional context or description for the case note
  createdAt: { 
    type: Date, 
    default: Date.now 
  } // Timestamp for note creation
});

module.exports = mongoose.model('CaseNote', CaseNoteSchema);
