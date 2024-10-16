require('dotenv').config();
const { Client } = require('pg');
const registerService = require('../model/registerService');
const nodemailer = require('nodemailer');
const { client: redisClient, redisConnect } = require('../../config/redisconfig');
const { config } = require('../../config/dbconfig');

async function sendOtp(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

async function register(req, res) {
  const { name, email, password, role, company, userinfo } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const client = new Client(config);
    await client.connect();

    const existingAccountByName = await registerService.getAccountByName(client, name);
    const existingAccountByEmail = await registerService.getAccountByEmail(client, email);

    await client.end();

    if (existingAccountByName) {
      return res.status(400).send('Account name already exists');
    }

    if (existingAccountByEmail) {
      return res.status(400).send('Email already exists');
    }

    await redisConnect();
    const userDetails = { name, email, password, role, company, userinfo };
    await redisClient.set(email, JSON.stringify({ otp, userDetails }), { EX: 300 }); // OTP and user details expire in 5 minutes
    await sendOtp(email, otp);
    res.status(200).send('OTP sent to email');
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).send('Error sending OTP');
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  try {
    await redisConnect();
    const storedData = await redisClient.get(email);

    if (!storedData) {
      return res.status(400).send('OTP expired or invalid');
    }

    const { otp: storedOtp, userDetails } = JSON.parse(storedData);

    if (storedOtp !== otp) {
      return res.status(400).send('Invalid OTP');
    }
    await registerService.createAccount(userDetails);
    res.status(201).send('Account created successfully');
  } catch (err) {
    console.error('Error verifying OTP or creating account:', err);
    res.status(500).send('Error verifying OTP or creating account');
  }
}

module.exports = {
  register,
  verifyOtp,
  sendOtp,
};