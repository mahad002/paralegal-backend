const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const caseController = require('../controllers/caseController');

// Case Management Routes
router.get('/', auth, caseController.getAllCases);
router.get('/:id', auth, caseController.getCaseById);
router.post('/', auth, caseController.createCase);
router.put('/:id', auth, caseController.updateCase);
router.delete('/:id', auth, caseController.deleteCase);
router.get('/user/:userId', auth, caseController.getCasesByUser);

// Firm-Specific Route
router.get('/firm/lawyers-cases', auth, caseController.getCasesByFirm); // Firm-only

module.exports = router;
