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
    if (account && await bcrypt.compare(password, account.account_password)) {
      const token = jwt.sign({ userId: account.account_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
}

module.exports = {
  register,
  login
};