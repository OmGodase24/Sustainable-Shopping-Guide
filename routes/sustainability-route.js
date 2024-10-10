const express = require('express');
const {getSustainabilityInfoBySku} = require('../controllers/sustainabilityController');
const router = express.Router();

// Updated route to fetch sustainability info by SKU without promptKey
router.get('/sustainability/:sku', getSustainabilityInfoBySku);
module.exports = router;
