require('dotenv').config();
const { connectToDatabase } = require('./config/dbconfig');
const { redisConnect } = require('./config/redisconfig');

async function testConnection() {
  await connectToDatabase();
  await redisConnect();
}

testConnection();