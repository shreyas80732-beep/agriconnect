const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    primaryCrops: { type: [String], default: [] },
    contact: { type: String, required: true },
    groupName: { type: String, default: '' }, // e.g. FPO / cooperative name
    experienceYears: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
