require('dotenv').config();
const accountService = require('../model/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function register(req, res) {
  const { name, email, password, userinfo_id, role } = req.body;
  try {
    await accountService.createAccount({ name, email, password, userinfo_id, role });
    res.status(201).send('Account created successfully');
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).send('Error creating account');
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const account = await accountService.getAccountByEmail(email);
    if (!account) {
      console.error('Account not found for email:', email);
      return res.status(401).send('Invalid email or password');
    }
    console.log('Logged in account:', account);
    const isPasswordValid = await bcrypt.compare(password, account.account_password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.error('Invalid password for email:', email);
      return res.status(401).send('Invalid email or password');
    }
    const secretOrPrivateKey = process.env.SECRET_KEY;
    const token = jwt.sign({ userId: account.account_id },secretOrPrivateKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
}

module.exports = {
  register,
  login
};