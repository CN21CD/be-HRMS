const { Client } = require('pg');
const { config } = require('../../config/dbconfig');
const { client: redisClient, redisConnect } = require('../../config/redisconfig');

async function getAllUsers() {
  const client = new Client(config);
  await client.connect();

  const cacheKey = 'all_users';
  await redisConnect();
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const query = 'SELECT * FROM users_infomation';
  try {
    const res = await client.query(query);
    await redisClient.set(cacheKey, JSON.stringify(res.rows), { EX: 3600 }); 
    return res.rows;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getUserById(id) {
  const client = new Client(config);
  await client.connect();

  const cacheKey = `user_${id}`;
  await redisConnect();
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const query = 'SELECT * FROM users_infomation WHERE user_id = $1';
  const values = [id];
  try {
    const res = await client.query(query, values);
    await redisClient.set(cacheKey, JSON.stringify(res.rows), { EX: 3600 });
    return res.rows;
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function addUser({ user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id }) {
  const client = new Client(config);
  await client.connect();
  const query = `INSERT INTO users_infomation(user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id)
                 VALUES($1, $2, $3, $4, $5, $6)`;
  const values = [user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id];
  try {
    const res = await client.query(query, values);
    await redisConnect();
    await redisClient.del('all_users'); 
    return res.rows;
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function updateUserById({ user_id, user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id }) {
  const client = new Client(config);
  await client.connect();
  const query = `UPDATE users_infomation
                 SET user_fullname = $2, user_birthday = $3, user_email = $4, user_address = $5, user_phonenumber = $6, user_company_id = $7
                 WHERE user_id = $1`;
  const values = [user_id, user_fullname, user_birthday, user_email, user_address, user_phonenumber, user_company_id];
  try {
    const res = await client.query(query, values);
    await redisConnect();
    await redisClient.del('all_users'); 
    await redisClient.del(`user_${user_id}`);
    return res.rows;
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  } finally {
    await client.end();
  }
}

// async function deleteUserById(user_id) {
//   const client = new Client(config);
//   await client.connect();
//   const query = `DELETE FROM users_infomation WHERE user_id = $1`;
//   const values = [user_id];
//   try {
//     const res = await client.query(query, values);
//     await redisConnect();
//     await redisClient.del('all_users'); 
//     await redisClient.del(`user_${user_id}`); 
//     return res.rows;
//   } catch (err) {
//     console.error('Error deleting user:', err);
//     throw err;
//   } finally {
//     await client.end();
//   }
// }

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUserById,
  // deleteUserById
};