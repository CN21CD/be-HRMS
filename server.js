require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./src/router/authRouter');
const authenticateToken = require('./src/middleware/authMiddleware');

const app = express();
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use(bodyParser.json());
app.use('/auth', authRouter);

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});