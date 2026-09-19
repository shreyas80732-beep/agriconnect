require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const Crop = require('./models/Crop');
const { defaultCrops } = require('./seed/cropData');

const cropRoutes = require('./routes/cropRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const aiRoutes = require('./routes/aiRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

const start = async () => {
  await connectDB();

  // Auto-seed crop reference data if the collection is empty. This makes
  // the in-memory DB mode (USE_MEMORY_DB=true) work with zero extra steps,
  // and is a harmless no-op once a real database has been seeded.
  try {
    const count = await Crop.countDocuments();
    if (count === 0) {
      await Crop.insertMany(defaultCrops);
      console.log(`Auto-seeded ${defaultCrops.length} crops (collection was empty).`);
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
};

start();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting to protect the Gemini/OpenWeather quota
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api', aiRoutes); // /api/recommend-crop, /api/yield-prediction, /api/detect-disease, /api/fertilizer-guide
app.use('/api/community', communityRoutes);

// Central error handler (e.g. multer file errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
