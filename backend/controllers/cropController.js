const Crop = require('../models/Crop');

// Get all crops
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id })
      .populate('farmId', 'farmName location');
    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get crops by farm
const getCropsByFarm = async (req, res) => {
  try {
    const crops = await Crop.find({
      farmId: req.params.farmId,
      userId: req.user.id
    });
    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create crop
const createCrop = async (req, res) => {
  try {
    const {
      farmId, cropName, variety,
      sowingDate, expectedHarvestDate,
      growthStage, areaUsed, notes
    } = req.body;

    if (!farmId || !cropName || !sowingDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm, crop name and sowing date'
      });
    }

    const crop = await Crop.create({
      farmId,
      userId: req.user.id,
      cropName,
      variety,
      sowingDate,
      expectedHarvestDate,
      growthStage,
      areaUsed,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Crop added successfully!',
      crop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update crop
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: 'Crop updated!', crop: updatedCrop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete crop
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Crop deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCrops, getCropsByFarm, createCrop, updateCrop, deleteCrop };