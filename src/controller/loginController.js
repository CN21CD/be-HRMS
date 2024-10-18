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
    const isPasswordValid = await bcrypt.compare(password, account.account_password);
    if (!isPasswordValid) {
      console.error('Invalid password for identifier:', identifier);
      return res.status(401).send('Invalid username/email or password');
    }
    const secretOrPrivateKey = process.env.SECRET_KEY;
    const tokenPayload = {
      account_id: account.account_id,
      role: account.account_role, // Assuming account_role is a property of account
      company_id: account.company_id // Assuming company_id is a property of account
    };
    const token = jwt.sign(tokenPayload, secretOrPrivateKey, { expiresIn: '1h' });

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