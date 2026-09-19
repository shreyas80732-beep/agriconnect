const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  recommendCrop,
  predictYield,
  detectDisease,
  fertilizerGuide,
} = require('../controllers/geminiController');

router.post('/recommend-crop', recommendCrop);
router.post('/yield-prediction', predictYield);
router.post('/detect-disease', upload.single('image'), detectDisease);
router.post('/fertilizer-guide', fertilizerGuide);

module.exports = router;
