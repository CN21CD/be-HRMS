const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

async function createAccount(account) {
  const client = new Client(config);
  await client.connect();

  const hashedPassword = await bcrypt.hash(account.password, 10);
  const createDate = moment().tz('Asia/Bangkok').format(); 
  const query = `
    INSERT INTO user_account (account_id, account_name, account_email, account_userinfo_id, account_password, account_createDate, account_role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    uuidv4().substring(0, 30), 
    account.name.substring(0, 30),
    account.email.substring(0, 30), 
    account.userinfo_id.substring(0, 30), 
    hashedPassword, 
    createDate, 
    account.role.substring(0, 30) 
  ];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error creating account:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getAccountByEmailOrUsername(identifier) {
  const client = new Client(config);
  await client.connect();

  const query = 'SELECT * FROM user_account WHERE account_email = $1 OR account_name = $2';
  const values = [identifier, identifier];

  try {
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      console.error('No account found with identifier:', identifier);
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching account:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getLoginHistory() {
  const client = new Client(config);
  await client.connect();

  const query = 'SELECT * FROM login_history ORDER BY login_time DESC';

  try {
    const res = await client.query(query);
    return res.rows;
  } catch (err) {
    console.error('Error fetching login history:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getLoginHistoryByAccountId(account_id) {
  const client = new Client(config);
  await client.connect();

  const query = 'SELECT * FROM login_history WHERE account_id = $1 ORDER BY login_time DESC';
  const values = [account_id];

  try {
    const res = await client.query(query, values);
    return res.rows;
  } catch (err) {
    console.error('Error fetching login history:', err);
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  createAccount,
  getAccountByEmailOrUsername,
  getLoginHistory,
  getLoginHistoryByAccountId
};