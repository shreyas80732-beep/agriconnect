const express = require('express');
const router = express.Router();
const { getAllCrops, getCropByName } = require('../controllers/cropController');

router.get('/', getAllCrops);
router.get('/:name', getCropByName);

module.exports = router;
