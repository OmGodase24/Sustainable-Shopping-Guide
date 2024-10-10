const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register); // Register user
router.post('/login', userController.login); // Login user

module.exports = router;
