const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log('Token:', token);

  if (!token) {
    req.user = { role: 'guest' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log('Decoded:', decoded);

    req.user = {
      account_id: decoded.account_id,
      role: decoded.role,
      company_id: decoded.company_id
    };
    console.log('company_id from token:', req.user.company_id);
    next();
  } catch (error) {
    console.error('Error:', error);
    req.user = { role: 'guest' };
    next();
  }
};

const adminMiddleware = (req, res, next) => {
  // console.log('User:', req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};

const userMiddleware = (req, res, next) => {
  // console.log('User:', req.user);
  if (req.user.role !== 'admin' && req.user.role !== 'user') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối' });
  }
  next();
};
const companyMiddleware = (req, res, next) => {
  const companyId = req.header('Company_ID');
  console.log('companyId:', companyId);
  if (parseInt(req.user.company_id, 10) !== parseInt(companyId, 10)) {
    return res.status(403).json({ message: 'Quyền truy cập công ty bị từ chối' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, userMiddleware, companyMiddleware };