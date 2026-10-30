const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  addReply,
  requestConsultation,
  getFarmers,
  addFarmer,
  addPlantedCrop,
  updateIrrigationMilestone,
  getCropPresets,
  getListings,
  createListing,
  updateListingStatus,
} = require('../controllers/communityController');
const { optionalAuth } = require('../middleware/auth');

// Forum
router.get('/forum', getPosts);
router.post('/forum', optionalAuth, createPost);
router.post('/forum/:id/reply', optionalAuth, addReply);

// Expert advice
router.post('/consultations', requestConsultation);

// Local connections (Farmers) & Crop Progress
router.get('/farmers', getFarmers);
router.post('/farmers', addFarmer);
router.post('/farmers/:farmerId/crops', optionalAuth, addPlantedCrop);
router.patch('/farmers/:farmerId/crops/:cropId/irrigation/:milestoneId', optionalAuth, updateIrrigationMilestone);
router.get('/crops/presets', getCropPresets);

// Marketplace (Seller sell posts & items)
router.get('/marketplace', getListings);
router.post('/marketplace', optionalAuth, createListing);
router.patch('/marketplace/:id', updateListingStatus);

module.exports = router;
