const express = require('express');
const account = require('../controller/accountCotroller');
const login = require('../controller/loginController');
const register = require('../controller/registerController');

const logLoginHistory = require('../middleware/logLoginHistory');

const router = express.Router();

router.post('/register', register.registerAdmin);
router.post('/register-user', register.registerUser);
router.post('/verify-otp', register.verifyOtp);
router.post('/resend-otp', register.resendOtp);


router.post('/login', login.login, logLoginHistory); 

router.get('/login-history', account.getLoginHistory);
router.get('/login-history/:account_id', account.getLoginHistoryById);
router.delete('/account/:account_id', account.deleteAccount);

module.exports = router;