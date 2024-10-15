const express = require('express');
const authController = require('../controller/authCotroller');
const logLoginHistory = require('../middleware/logLoginHistory');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login, logLoginHistory); // logLoginHistory should be called after authController.login
router.get('/login-history', authController.getLoginHistory);
router.get('/login-history/:account_id', authController.getLoginHistoryById);
router.delete('/account/:account_id', authController.deleteAccount);


module.exports = router;