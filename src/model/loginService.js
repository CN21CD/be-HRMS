const { Client } = require('pg');
const { config } = require('../../config/dbconfig');

async function getAccountByEmailOrUsername(identifier) {
  const client = new Client(config);
  await client.connect();

  const query = `
    SELECT ua.*, ui.user_company_id AS company_id
    FROM user_account ua
    JOIN users_infomation ui ON ua.account_userinfo_id = ui.user_id
    WHERE ua.account_email = $1 OR ua.account_name = $2
  `;
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

module.exports = {
  getAccountByEmailOrUsername,
};