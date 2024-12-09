const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [
      'admin',           // Admin Panel access
      'legal_researcher', // Compliance Bot and Case Notes
      'lawyer',          // Case Logs, Compliance Bot, Assistance Bot, Case Notes
      'judge',           // Case Logs, Compliance Bot, Assistance Bot, Case Notes
      'legal_professional' // Case Logs, Compliance Bot, Assistance Bot, Case Notes
    ],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
