const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  soilType: {
    type: String,
    enum: ['clay', 'loamy', 'sandy', 'silt', 'peaty'],
    default: 'loamy'
  },
  farmSize: {
    type: Number,
    required: [true, 'Farm size is required']
  },
  sizeUnit: {
    type: String,
    enum: ['acres', 'hectares', 'bigha'],
    default: 'acres'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farm', farmSchema);