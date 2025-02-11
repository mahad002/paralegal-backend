const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Use your auth middleware
const caseController = require('../controllers/caseController');

// Case Management Routes
router.get('/', auth, caseController.getAllCases); // Admin & Firm Users
router.get('/:id', auth, caseController.getCaseById); // Get specific case by ID
router.post('/', auth, caseController.createCase); // Create a new case
router.put('/:id', auth, caseController.updateCase); // Update case (with commit tracking)
router.delete('/:id', auth, caseController.deleteCase); // Admin only: Delete case
router.get('/user/:userId', auth, caseController.getCasesByUser); // Get cases for specific user

// Firm-Specific Route: Get cases by Firm (with lawyer support)
router.get('/firm/lawyers-cases', auth, caseController.getCasesByFirm); // Firm-only: Get cases related to the firm’s lawyers

// Revert a case to a specific commit (admin/user can revert)
router.post('/revert/:caseId/:commitId', auth, caseController.revertCaseToCommit); // Revert to a specific commit

module.exports = router;
