require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./src/router/authRouter');
const companyRouter = require('./src/router/companyRouter');
const userRouter = require('./src/router/userRouter');
const app = express();
const hostname ='localhost';
const port =8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use('/api/auth', authRouter);
app.use('/api/data', companyRouter);
app.use('/api/data', userRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Wellcome HRMS API by XiamTeam" });
});
app.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});
