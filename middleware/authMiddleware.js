const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route (ensure user is authenticated)
exports.protect = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Token verification
      req.user = decoded.user;  // Attach decoded user to request
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
  
// Admin-only access
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  next();
};
