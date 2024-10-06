const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    enableArithAbort: true,
    trustServerCertificate: true // Bypass self-signed certificate check
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN,
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  }
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to the database successfully');
  } catch (err) {
    console.error('Database connection failed: ', err);
  }
}

module.exports = {
  sql,
  connectToDatabase
};

// const sql = require('mssql');

// const config = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: true, // Use this if you're on Windows Azure
//     enableArithAbort: true,
//     trustedConnection: true, // Use Windows Authentication
//     trustServerCertificate: true // Bypass self-signed certificate check
//   }
// };

// async function connectToDatabase() {
//   try {
//     await sql.connect(config);
//     console.log('Connected to the database successfully');
//   } catch (err) {
//     console.error('Database connection failed: ', err);
//   }
// }

// module.exports = {
//   sql,
//   connectToDatabase
// };