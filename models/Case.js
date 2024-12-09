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
  parties: {
    plaintiff: { 
      name: { type: String }, 
      identification: { type: String } 
    },
    defendant: { 
      name: { type: String }, 
      identification: { type: String } 
    }
  },
  documents: [{
    documentType: { type: String },
    documentNumber: { type: String },
    executionDate: { type: Date }
  }],
  commits: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CaseCommit' 
  }], // Linked commit history for the case
  chatHistory: {
    assistanceBot: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ChatHistory' 
    }]
  }, // Chat history linked to the case-specific assistance bot
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Case', CaseSchema);
