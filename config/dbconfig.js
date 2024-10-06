const { Client } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'HRMS',
  password: process.env.DB_PASSWORD || '234792',
  port: process.env.DB_PORT || '5432',
};

async function connectToDatabase() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to the database successfully');
  } catch (err) {
    console.error('Database connection failed: ', err);
  } finally {
    await client.end();
  }
}

module.exports = {
  config,
  connectToDatabase
};