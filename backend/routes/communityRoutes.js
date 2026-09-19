const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  addReply,
  requestConsultation,
  getFarmers,
  addFarmer,
  getListings,
  createListing,
  updateListingStatus,
} = require('../controllers/communityController');

// Forum
router.get('/forum', getPosts);
router.post('/forum', createPost);
router.post('/forum/:id/reply', addReply);

// Expert advice
router.post('/consultations', requestConsultation);

// Local connections
router.get('/farmers', getFarmers);
router.post('/farmers', addFarmer);

// Marketplace
router.get('/marketplace', getListings);
router.post('/marketplace', createListing);
router.patch('/marketplace/:id', updateListingStatus);

module.exports = router;
