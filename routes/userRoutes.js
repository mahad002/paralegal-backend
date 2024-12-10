const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Authentication Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// User Management Routes
router.get('/', auth, userController.getAllUsers); // Admin-only
router.get('/:id', auth, userController.getUserById); // Admin or self
router.put('/:id', auth, userController.updateUser); // Admin or self
router.delete('/:id', auth, userController.deleteUser); // Admin-only

router.get('/me', auth, userController.getCurrentUser);

module.exports = router;
