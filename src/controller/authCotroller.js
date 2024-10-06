const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./model/account');

const secretKey = 'your_secret_key';

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.getUserByEmail(email);

  if (user && bcrypt.compareSync(password, user.account_password)) {
    const token = jwt.sign({ id: user.account_id, role: user.account_role }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
}

async function register(req, res) {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const account_createDate = new Date();
  const account_id = `acc${account_createDate.toISOString().split('T')[0].replace(/-/g, '')}${Math.floor(Math.random() * 1000)}`;

  const newUser = {
    account_id,
    account_name: name,
    account_email: email,
    account_userinfo_id: null,
    account_password: hashedPassword,
    account_createDate,
    account_role: role
  };

  await userModel.createUser(newUser);
  res.status(201).json({ message: 'User registered successfully' });
}

module.exports = {
  login,
  register
};