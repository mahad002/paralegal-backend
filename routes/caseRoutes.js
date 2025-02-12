const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Use your auth middleware
const caseController = require('../controllers/caseController');

// Case Management Routes
router.get('/', auth.protect, caseController.getAllCases); // Admin & Firm Users
router.get('/:id', auth.protect, caseController.getCaseById); // Get specific case by ID
router.post('/', auth.protect, caseController.createCase); // Create a new case
router.put('/:id', auth.protect, caseController.updateCase); // Update case (with commit tracking)
router.delete('/:id', auth.protect, caseController.deleteCase); // Admin only: Delete case
router.get('/user/:userId', auth.protect, caseController.getCasesByUser); // Get cases for specific user

// Firm-Specific Route: Get cases by Firm (with lawyer support)
router.get('/firm/lawyers-cases', auth.protect, caseController.getCasesByFirm); // Firm-only: Get cases related to the firm’s lawyers

// Revert a case to a specific commit (admin/user can revert)
router.post('/revert/:caseId/:commitId', auth.protect, caseController.revertCaseToCommit); // Revert to a specific commit

module.exports = router;
