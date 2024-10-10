// const express = require('express');
// const { getFormattedData } = require('../controllers/formatController');

// const router = express.Router();

// // Route to fetch combined formats based on admin's preferences
// router.post('/combined', getFormattedData);

// module.exports = router;

const express = require('express');
const { createFormat, getFormats,getFormatById, getFormattedData, activateFormat, deactivateFormat } = require('../controllers/formatController');
const router = express.Router();

router.post('/', createFormat);
router.get('/', getFormats);
router.get('/:promptKey', getFormatById);
router.patch('/activate/:promptKey', activateFormat);
router.post('/combined', getFormattedData);
router.patch('/deactivate/:promptKey', deactivateFormat);
module.exports = router;
