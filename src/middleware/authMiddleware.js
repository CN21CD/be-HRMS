const jwt = require('jsonwebtoken');
const { pool } = require('../../config/dbconfig');

require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token:', token);

  if (!token) {
    req.user = { role: 'guest' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded:', decoded);
    const client = await pool.connect();

    try {
      const query = 'SELECT account_role FROM user_account WHERE account_id = $1';
      const values = [decoded.account_id];
      const result = await client.query(query, values);
      console.log('DB Result:', result.rows);

      req.user = {
        account_id: decoded.account_id,
        role: result.rows.length ? result.rows[0].account_role : 'guest'
      };
    } finally {
      client.release();
    }

    next();
  } catch (error) {
    console.error('Error:', error);
    req.user = { role: 'guest' };
    next();
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('User:', req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  console.log('User:', req.user);
  if (req.user.role !== 'admin' && req.user.role !== 'user') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, userMiddleware };