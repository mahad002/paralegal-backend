// // routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, updatePassword, deleteAccount, editProfile } = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware'); // You will need to create this middleware to protect routes

// // Register route
// router.post('/register', registerUser);

// // Login route
// router.post('/login', loginUser);

// // Update password route
// // router.patch('/password', authMiddleware, (req, res, next) => {
// //     updatePassword(req, res, next); // Call the updatePassword function here
// // });

// // Delete account route
// // router.delete('/', authMiddleware, deleteAccount);

// // Edit profile route
// // router.patch('/profile', authMiddleware, editProfile);

// module.exports = router;

// routes/authRoutes.js

// // routes/userRoutes.js
// const express = require('express');
// const { createUser } = require('../controllers/userController');

// const router = express.Router();

// // Route to create a user
// router.post('/', createUser);

// module.exports = router;

// routes/userRoutes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser,
    updatePassword
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/profile', auth, getProfile);          // Get user profile
router.put('/profile', auth, updateUser);          // Update user profile
router.delete('/profile', auth, deleteUser);       // Delete user account
router.put('/password', auth, updatePassword);     // Update password

module.exports = router;
