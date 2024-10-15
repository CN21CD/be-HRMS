require('dotenv').config();
const accountService = require('../model/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function register(req, res) {
  const { name, email, password, role, company, userinfo } = req.body;
  try {
    await accountService.createAccount({
      name,
      email,
      password,
      role,
      company: {
        name: company.name,
        phonenumber: company.phonenumber,
        email: company.email,
        address: company.address
      },
      userinfo: {
        fullname: userinfo.fullname,
        birthday: userinfo.birthday,
        email: userinfo.email,
        address: userinfo.address,
        phonenumber: userinfo.phonenumber
      }
    });
    res.status(201).send('Account created successfully');
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).send('Error creating account');
  }
}

async function login(req, res, next) {
  const { identifier, password } = req.body; 
  try {
    const account = await accountService.getAccountByEmailOrUsername(identifier);
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
    const token = jwt.sign({ userId: account.account_id }, secretOrPrivateKey, { expiresIn: '1h' });
    
    // Add account_id to request body for logLoginHistory middleware
    req.body.account_id = account.account_id;

    res.json({ token });
    next();
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
}

async function getLoginHistory(req, res) {
  try {
    const history = await accountService.getLoginHistory();
    res.json(history);
  } catch (err) {
    console.error('Error fetching login history:', err);
    res.status(500).send('Error fetching login history');
  }
}

async function getLoginHistoryById(req, res) {
  const { account_id } = req.params;
  try {
    const history = await accountService.getLoginHistoryByAccountId(account_id);
    res.json(history);
  } catch (err) {
    console.error('Error fetching login history:', err);
    res.status(500).send('Error fetching login history');
  }
}

async function deleteAccount(req, res) {
  const { account_id } = req.params;
  try {
    await accountService.deleteAccount(account_id);
    res.status(200).send('Account deleted successfully');
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).send('Error deleting account');
  }
}

module.exports = {
  register,
  login,
  getLoginHistory,
  getLoginHistoryById,
  deleteAccount
};