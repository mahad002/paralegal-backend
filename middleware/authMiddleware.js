const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    
    console.log('✅ Middleware Passed! User:', req.user); // ADD THIS
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    console.log('❌ Access Denied: Not an Admin');
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  console.log('✅ Admin Access Granted');
  next();
};
