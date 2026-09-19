// Manual seed script: `npm run seed`
// Note: if USE_MEMORY_DB=true, prefer just running `npm run dev` — the
// server auto-seeds an empty in-memory DB on startup automatically.
require('dotenv').config();
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const { defaultCrops } = require('./cropData');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Crop.deleteMany({});
    console.log('Existing crop data cleared.');

    await Crop.insertMany(defaultCrops);
    console.log(`Seeded ${defaultCrops.length} crops successfully.`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();
