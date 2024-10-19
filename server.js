require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRouter = require('./src/router/accountRouter');
const companyRouter = require('./src/router/companyRouter');
const userRouter = require('./src/router/userRouter');
const { sendOtp } = require('./src/controller/registerController'); // Adjust the path as necessary

const app = express();
const hostname = 'localhost';
const port = 8000;

app.use(cors());

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

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome HRMS API by XiamTeam' });
});

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});