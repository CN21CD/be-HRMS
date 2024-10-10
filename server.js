require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./src/router/authRouter');

const app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use('/api/auth', authRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});