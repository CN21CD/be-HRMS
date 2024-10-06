const express = require('express');
const authController = require('./authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;