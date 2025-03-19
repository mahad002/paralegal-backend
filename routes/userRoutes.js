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
router.get('/me', auth.protect, userController.getCurrentUser);
router.get('/', auth.protect, auth.admin, userController.getAllUsers);
router.get('/:id', auth.protect, userController.getUserById);
router.put('/:id', auth.protect, userController.updateUser);
router.delete('/:id', auth.protect, auth.admin, userController.deleteUser);

// Lawyer Management Routes for Firms
router.get('/lawyers', auth.protect, userController.getLawyersByFirm); // Get firm’s lawyers
router.post('/lawyers/add', auth.protect, userController.addExistingLawyerToFirm); // Add an existing lawyer
router.post('/lawyers/register', auth.protect, userController.registerLawyerThroughFirm); // Register a new lawyer under a firm
router.delete('/lawyers/:lawyerId', auth.protect, userController.removeLawyerFromFirm); // Remove a lawyer from a firm

module.exports = router;
