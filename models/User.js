// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For secure storage, hash this
  role: {
    type: String,
    enum: ['admin', 'legal_researcher', 'lawyer', 'judge', 'legal_professional'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
