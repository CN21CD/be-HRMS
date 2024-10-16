require('dotenv').config();
const loginService = require('../model/loginService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function login(req, res, next) {
  const { identifier, password } = req.body;
  try {
    const account = await loginService.getAccountByEmailOrUsername(identifier);
    if (!account) {
      console.error('Account not found for identifier:', identifier);
      return res.status(401).send('Invalid username/email or password');
    }
    console.log('Logged in account:', account);
    const isPasswordValid = await bcrypt.compare(password, account.account_password);
    if (!isPasswordValid) {
      console.error('Invalid password for identifier:', identifier);
      return res.status(401).send('Invalid username/email or password');
    }
    const secretOrPrivateKey = process.env.SECRET_KEY;
    const token = jwt.sign({ account_id: account.account_id }, secretOrPrivateKey, { expiresIn: '1h' });

    // Add account_id to request body for logLoginHistory middleware
    req.body.account_id = account.account_id;
    res.json({ token });
    next();
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
}

module.exports = {
  login,
};