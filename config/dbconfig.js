const { Sequelize, DataTypes } = require('sequelize');
const { Pool } = require('pg');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SUPABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const config = {
  connectionString: process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool({
  connectionString: config.connectionString,
  ssl: config.ssl,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  config,
  connectToDatabase,
  sequelize,
  pool
};