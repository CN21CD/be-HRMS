require('dotenv').config();
const { connectToDatabase } = require('./config/dbconfig');

async function testConnection() {
  await connectToDatabase();
}

testConnection();