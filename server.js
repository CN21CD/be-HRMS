require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRouter = require('./src/router/accountRouter');
const companyRouter = require('./src/router/companyRouter');
const userRouter = require('./src/router/userRouter');
const { sendOtp } = require('./src/controller/registerController'); // Adjust the path as necessary

const app = express();
const hostname = 'localhost';
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use('/api/auth', authRouter);
app.use('/api/data', companyRouter);
app.use('/api/data', userRouter);

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    await sendOtp(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

app.get('/send-otp-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sentOTP.html'));
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome HRMS API by XiamTeam' });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});