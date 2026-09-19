const Crop = require('../models/Crop');

// GET /api/crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find({}).sort({ cropName: 1 });
    res.json(crops);
  } catch (err) {
    console.error('getAllCrops error:', err.message);
    res.status(500).json({ error: 'Failed to fetch crops.' });
  }
};

// GET /api/crops/:name
const getCropByName = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      cropName: new RegExp(`^${req.params.name}$`, 'i'),
    });
    if (!crop) return res.status(404).json({ error: 'Crop not found.' });
    res.json(crop);
  } catch (err) {
    console.error('getCropByName error:', err.message);
    res.status(500).json({ error: 'Failed to fetch crop.' });
  }
};

module.exports = { getAllCrops, getCropByName };
