const Farm = require('../models/Farm');

// Get all farms of logged in user
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user.id });
    res.json({
      success: true,
      count: farms.length,
      farms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new farm
const createFarm = async (req, res) => {
  try {
    const { farmName, location, soilType, farmSize, sizeUnit, description } = req.body;

    if (!farmName || !location || !farmSize) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm name, location and size'
      });
    }

    const farm = await Farm.create({
      userId: req.user.id,
      farmName,
      location,
      soilType,
      farmSize,
      sizeUnit,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully!',
      farm
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update farm
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const updatedFarm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: 'Farm updated!', farm: updatedFarm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete farm
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Farm.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Farm deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFarms, createFarm, updateFarm, deleteFarm };