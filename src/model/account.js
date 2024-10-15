const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

async function createCompany(client, company_name, company_phonenumber, company_email, company_address) {
  const query = `
    INSERT INTO company_info (company_name, company_phonenumber, company_email, company_address)
    VALUES ($1, $2, $3, $4)
    RETURNING company_id
  `;
  const values = [
    company_name.substring(0, 30),
    company_phonenumber.substring(0, 50),
    company_email.substring(0, 30),
    company_address.substring(0, 100)
  ];
  const res = await client.query(query, values);
  return res.rows[0].company_id;
}

async function createUserInfo(client, user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id) {
  const query = `
    INSERT INTO users_infomation (user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id
  `;
  const values = [
    user_fullname.substring(0, 30),
    user_birthday,
    user_email.substring(0, 30),
    user_address.substring(0, 100),
    user_phonenumber.substring(0, 50),
    user_company_id
  ];
  const res = await client.query(query, values);
  return res.rows[0].user_id;
}


async function createAccount(account) {
  const client = new Client(config);
  await client.connect();

  try {
       // Connection Consistency, tránh rollback khi insert 2 bảng, chỉ mở kết nối khi regisster được gọi
    const company_id = await createCompany(
      client,
      account.company.name,
      account.company.phonenumber,
      account.company.email,
      account.company.address
    );
    
     const userinfo_id = await createUserInfo(
      client,
      account.userinfo.fullname,
      account.userinfo.birthday,
      account.userinfo.email,
      account.userinfo.address,
      account.userinfo.phonenumber,
      company_id
    );
 
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
      userinfo_id,
      hashedPassword,
      createDate,
      account.role.substring(0, 30)
    ];

    await client.query(query, values);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
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

async function deleteAccount(account_id) {
  const client = new Client(config);
  await client.connect();

  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM user_account WHERE account_id = $1', [account_id]);
    await client.query('DELETE FROM users_infomation WHERE user_id = (SELECT account_userinfo_id FROM user_account WHERE account_id = $1)', [account_id]);
    await client.query('DELETE FROM company_info WHERE company_id = (SELECT user_company_id FROM users_infomation WHERE user_id = (SELECT account_userinfo_id FROM user_account WHERE account_id = $1))', [account_id]);

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
  createCompany,
  createUserInfo,
  createAccount,
  getAccountByEmailOrUsername,
  getLoginHistory,
  deleteAccount
};