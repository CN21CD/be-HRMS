const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const config = require('../../config/dbconfig');

require('dotenv').config();

const pool = new Pool(config);

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = { role: 'guest' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT account_role FROM user_account WHERE account_id = $1',
        [req.user.account_id]
      );

      if (result.rows.length === 0) {
        req.user.role = 'guest';
      } else {
        req.user.role = result.rows[0].account_role;
      }
    } finally {
      client.release();
    }

    next();
  } catch (error) {
    req.user = { role: 'guest' };
    next();
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'user') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, userMiddleware };