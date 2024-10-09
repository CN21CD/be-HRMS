//dev environment--------
// const { Client } = require('pg');
// require('dotenv').config();

// const config = {
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'HRMS',
//   password: process.env.DB_PASSWORD || '234792',
//   port: process.env.DB_PORT || '5432',
// };

// async function connectToDatabase() {
//   const client = new Client(config);
//   try {
//     await client.connect();
//     console.log('Connected to the database successfully');
//   } catch (err) {
//     console.error('Database connection failed: ', err);
//   } finally {
//     await client.end();
//   }
// }

// module.exports = {
//   config,
//   connectToDatabase
// };

//product environment-------
const { Sequelize, DataTypes } = require('sequelize');
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
  sequelize
};