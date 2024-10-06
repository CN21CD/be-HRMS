const sql = require('mssql');

const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'HRMSbyCN21CD'
};

async function getUserByEmail(email) {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('email', sql.NVarChar(50), email)
    .query('SELECT * FROM user_account WHERE account_email = @email');
  return result.recordset[0];
}

async function createUser(account) {
  let pool = await sql.connect(config);
  await pool.request()
    .input('account_id', sql.NVarChar(30), account.account_id)
    .input('account_name', sql.NVarChar(30), account.account_name)
    .input('account_email', sql.NVarChar(50), account.account_email)
    .input('account_userinfo_id', sql.NVarChar(30), account.account_userinfo_id)
    .input('account_password', sql.NVarChar(sql.MAX), account.account_password)
    .input('account_createDate', sql.Date, account.account_createDate)
    .input('account_role', sql.NVarChar, account.account_role)
    .query(`INSERT INTO user_account (account_id, account_name, account_email, account_userinfo_id, account_password, account_createDate, account_role)
            VALUES (@account_id, @account_name, @account_email, @account_userinfo_id, @account_password, @account_createDate, @account_role)`);
}

module.exports = {
  getUserByEmail,
  createUser
};