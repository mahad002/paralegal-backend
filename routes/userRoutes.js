const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');  // Importing the auth middleware
const userController = require('../controllers/userController');

// Authentication Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// User Management Routes
router.get('/me', auth.protect, userController.getCurrentUser);  // Protecting the 'me' route
router.get('/', auth.protect, auth.admin, userController.getAllUsers);  // Admin-only route to get all users
router.get('/:id', auth.protect, userController.getUserById);  // Protecting 'get user by id' route
router.put('/:id', auth.protect, userController.updateUser);  // Protecting the 'update user' route
router.delete('/:id', auth.protect, auth.admin, userController.deleteUser);  // Admin-only route to delete a user

// Lawyer Management Routes for Firms
router.get('/lawyers', auth.protect, userController.getLawyersByFirm);  // Get lawyers under a firm
router.post('/lawyers', auth.protect, userController.addLawyerToFirm);  // Add lawyer to a firm
router.delete('/lawyers/:lawyerId', auth.protect, userController.removeLawyerFromFirm);  // Remove lawyer from a firm

module.exports = router;
