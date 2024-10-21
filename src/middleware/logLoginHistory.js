const { Client } = require('pg');
const { config } = require('../../config/dbconfig');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

async function logLoginHistory(req, res, next) {
  const client = new Client(config);
  await client.connect();

  const { account_id } = req.body;
  let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip_address && ip_address.includes(',')) {
    ip_address = ip_address.split(',')[0].trim();
  }
  const login_time = moment().tz('Asia/Bangkok').format();
  console.log('ip_address login to system', ip_address);
  
  const id = uuidv4().replace(/-/g, '').substring(0, 30);
  if (!account_id) {
    console.error('account_id is missing in the request body');
    await client.end();
    return res.status(400).send('account_id is required');
  }

  try {
    await client.query(
      'INSERT INTO login_history (id, account_id, ip_address, login_time) VALUES ($1, $2, $3, $4)',
      [id, account_id, ip_address, login_time]
    );
    next();
  } catch (err) {
    console.error('Error logging login history:', err);
    if (!res.headersSent) {
      res.status(500).send('Error logging login history');
    }
  } finally {
    await client.end();
  }
}

module.exports = logLoginHistory;