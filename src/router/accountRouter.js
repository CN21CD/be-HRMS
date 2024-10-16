const express = require('express');
const account = require('../controller/accountCotroller');
const login = require('../controller/loginController');
const register = require('../controller/registerController');

const logLoginHistory = require('../middleware/logLoginHistory');

const router = express.Router();

router.post('/register', register.register);
router.post('/verify-otp', register.verifyOtp);

router.post('/login', login.login, logLoginHistory); // logLoginHistory should be called after authController.login

router.get('/login-history', account.getLoginHistory);
router.get('/login-history/:account_id', account.getLoginHistoryById);
router.delete('/account/:account_id', account.deleteAccount);

module.exports = router;