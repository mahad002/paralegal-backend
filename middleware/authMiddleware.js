const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach decoded user information to req
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = auth;
