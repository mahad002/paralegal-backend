// // middleware/authMiddleware.js

// const authMiddleware = (req, res, next) => {
//     // Check if the request is for signup or login
//     const isSignup = req.path === '/signup';
//     const isLogin = req.path === '/login';

//     // Extract fields from the request body
//     const { name, email, password, role } = req.body;

//     if (isSignup) {
//         // Validate fields for signup
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ message: 'All signup fields are required.' });
//         }

//         // Add additional role validation if needed
//         const validRoles = ['admin', 'legal_researcher', 'lawyer', 'judge', 'legal_professional'];
//         if (!validRoles.includes(role)) {
//             return res.status(400).json({ message: 'Invalid role.' });
//         }

//     } else if (isLogin) {
//         // Validate fields for login
//         if (!email || !password) {
//             return res.status(400).json({ message: 'Email and password are required.' });
//         }
//     }

//     // Proceed to the next middleware/controller
//     next();
// };

// module.exports = authMiddleware;

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Bearer
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;

