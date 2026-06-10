const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  variety: {
    type: String,
    default: ''
  },
  sowingDate: {
    type: Date,
    required: [true, 'Sowing date is required']
  },
  expectedHarvestDate: {
    type: Date
  },
  growthStage: {
    type: String,
    enum: ['sowing', 'germination', 'growing', 'flowering', 'harvesting'],
    default: 'sowing'
  },
  status: {
    type: String,
    enum: ['healthy', 'needs attention', 'critical'],
    default: 'healthy'
  },
  areaUsed: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);