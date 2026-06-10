const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    default: 'General'
  },
  question: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Advisory', advisorySchema);