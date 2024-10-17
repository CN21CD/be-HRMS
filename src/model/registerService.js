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

async function createAdminAccount(account) {
  const client = new Client(config);
  await client.connect();

  try {
    await client.query('BEGIN');

    const existingAccountByName = await getAccountByName(client, account.name);
    const existingAccountByEmail = await getAccountByEmail(client, account.email);

    if (existingAccountByName) {
      throw new Error('Account name already exists');
    }

    if (existingAccountByEmail) {
      throw new Error('Email already exists');
    }

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


async function createUserAccount(account) {
  const client = new Client(config);
  await client.connect();

  try {
    await client.query('BEGIN');

    const existingAccountByName = await getAccountByName(client, account.name);
    const existingAccountByEmail = await getAccountByEmail(client, account.email);

    if (existingAccountByName) {
      throw new Error('Account name already exists');
    }

    if (existingAccountByEmail) {
      throw new Error('Email already exists');
    }

    const userinfo_id = await createUserInfo(
      client,
      account.userinfo.fullname,
      account.userinfo.birthday,
      account.userinfo.email,
      account.userinfo.address,
      account.userinfo.phonenumber,
      account.company_id
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
    console.error('Error creating user without company:', err);
    throw err;
  } finally {
    await client.end();
  }
}


async function getAccountByName(client, name) {
  const query = 'SELECT * FROM user_account WHERE account_name = $1';
  const values = [name];

  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching account by name:', err);
    throw err;
  }
}

async function getAccountByEmail(client, email) {
  const query = 'SELECT * FROM user_account WHERE account_email = $1';
  const values = [email];

  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching account by email:', err);
    throw err;
  }
}

module.exports = {
  createCompany,
  createUserInfo,
  createAdminAccount,
  createUserAccount,
  getAccountByName,
  getAccountByEmail,
};