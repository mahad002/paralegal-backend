const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Securely store hashed passwords
  role: {
    type: String,
    enum: ['admin', 'firm', 'lawyer', 'judge', 'legal_professional', 'legal_researcher'],
    required: true,
  },
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the 'firm' user document
    default: null,  // null if the user is not associated with any firm (only for 'lawyer' role)
  },
  lawyers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // This is referencing the 'User' collection (the lawyer model)
    },
  ]   // Only for role 'firm'
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
