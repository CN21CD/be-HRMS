const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

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

async function deleteAccount(account_id) {
  const client = new Client(config);
  await client.connect();

  try {
    await client.query('BEGIN');

    const userInfoResult = await client.query('SELECT account_userinfo_id FROM user_account WHERE account_id = $1', [account_id]);
    const userinfo_id = userInfoResult.rows[0].account_userinfo_id;

    const companyResult = await client.query('SELECT user_company_id FROM users_infomation WHERE user_id = $1', [userinfo_id]);
    const company_id = companyResult.rows[0].user_company_id;

    // Delete login history
    await client.query('DELETE FROM login_history WHERE account_id = $1', [account_id]);

    // Delete the account
    await client.query('DELETE FROM user_account WHERE account_id = $1', [account_id]);

    // Delete the user information
    await client.query('DELETE FROM users_infomation WHERE user_id = $1', [userinfo_id]);

    // Delete the company information
    await client.query('DELETE FROM company_info WHERE company_id = $1', [company_id]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting account:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function deleteUserAccount(account_id) {
  const client = new Client(config);
  await client.connect();

  try {
    await client.query('BEGIN');

    const userInfoResult = await client.query('SELECT account_userinfo_id FROM user_account WHERE account_id = $1', [account_id]);
    const userinfo_id = userInfoResult.rows[0].account_userinfo_id;

    const companyResult = await client.query('SELECT user_company_id FROM users_infomation WHERE user_id = $1', [userinfo_id]);
    const company_id = companyResult.rows[0].user_company_id;

    // Delete login history
    await client.query('DELETE FROM login_history WHERE account_id = $1', [account_id]);

    // Delete the account
    await client.query('DELETE FROM user_account WHERE account_id = $1', [account_id]);

    // Delete the user information
    await client.query('DELETE FROM users_infomation WHERE user_id = $1', [userinfo_id]);
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting account:', err);
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  getLoginHistory,
  getLoginHistoryByAccountId,
  deleteAccount,
  deleteUserAccount
};