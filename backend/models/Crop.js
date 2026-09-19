const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prevention: { type: String, required: true },
  },
  { _id: false }
);

const cropSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    optimalTempMin: { type: Number, required: true }, // Celsius
    optimalTempMax: { type: Number, required: true }, // Celsius
    optimalRainfall: { type: String, required: true }, // e.g. "600-1200 mm/year"
    soilType: { type: [String], required: true }, // e.g. ["Loamy", "Clay"]
    fertilizerGuide: {
      seedling: { type: String, default: '' },
      vegetative: { type: String, default: '' },
      flowering: { type: String, default: '' },
      maturity: { type: String, default: '' },
    },
    commonDiseases: { type: [diseaseSchema], default: [] },
    averageMarketPrice: { type: String, default: 'N/A' }, // fallback, live price fetched via Gemini/market API
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
