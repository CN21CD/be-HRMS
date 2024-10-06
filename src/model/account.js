const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

async function createAccount(account) {
  const client = new Client(config);
  await client.connect();

  const hashedPassword = await bcrypt.hash(account.password, 10);
  const createDate = moment().tz('Asia/Bangkok').format(); // Lấy ngày tạo theo múi giờ +7
  const query = `
    INSERT INTO user_account (account_id, account_name, account_email, account_userinfo_id, account_password, account_createDate, account_role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    uuidv4().substring(0, 30), // Ensure UUID is within 30 characters
    account.name.substring(0, 30), // Ensure name is within 30 characters
    account.email.substring(0, 30), // Ensure email is within 30 characters
    account.userinfo_id.substring(0, 30), // Ensure userinfo_id is within 30 characters
    hashedPassword, // Sử dụng mật khẩu đã băm
    createDate, // Sử dụng ngày tạo theo múi giờ +7
    account.role.substring(0, 30) // Ensure role is within 30 characters
  ];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error creating account:', err);
    throw err; // Re-throw the error to be caught in the controller
  } finally {
    await client.end();
  }
}


async function getAccountByEmail(email) {
  const client = new Client(config);
  await client.connect();

  const query = 'SELECT * FROM user_account WHERE account_email = $1';
  const values = [email];

  try {
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      console.error('No account found with email:', email);
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching account:', err);
    throw err; // Re-throw the error to be caught in the controller
  } finally {
    await client.end();
  }
}

module.exports = {
  createAccount,
  getAccountByEmail
};