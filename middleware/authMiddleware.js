const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;  // Attach user info to the request object
    console.log('User:', req.user); // Log to see if user is being attached
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin-only access
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  next();
};
