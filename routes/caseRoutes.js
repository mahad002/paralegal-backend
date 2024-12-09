// const express = require('express');
// const { createCase, getCaseById, updateCase, getAllCases } = require('../controllers/caseController');
// const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// const router = express.Router();

// // Create a new case
// router.post('/', authMiddleware, createCase);

// // Get all cases (Admins, Lawyers, Judges, etc.)
// router.get('/', authMiddleware, getAllCases);

// // Get a single case by ID
// router.get('/:caseId', authMiddleware, getCaseById);

// // Update a case (status, assignments, etc.)
// router.put('/:caseId', authMiddleware, updateCase);

// module.exports = router;

const express = require('express');
const { createCase, getAllCases, getCaseById } = require('../controllers/caseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createCase); // Create a new case
router.get('/', authMiddleware, getAllCases); // Get all cases
router.get('/:id', authMiddleware, getCaseById); // Get case by ID

module.exports = router;
