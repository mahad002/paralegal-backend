// const express = require('express');
// const { createCommit, getCommitsForCase } = require('../controllers/caseCommitController');
// const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// const router = express.Router();

// // Create a new commit for a case
// router.post('/:caseId/commits', authMiddleware, createCommit);

// // Get all commits for a specific case
// router.get('/:caseId/commits', authMiddleware, getCommitsForCase);

// module.exports = router;

const express = require('express');
const {
    createCaseCommit,
    getCommitsByIds
} = require('../controllers/caseCommitController'); // Adjust the path if needed
const {
    getCaseWithCommits,
    listAllCommits
} = require('../controllers/caseController'); // Adjust the path if needed
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a case commit
router.post('/', authMiddleware, createCaseCommit); 

// Get case details with commits
// router.get('/case/:caseId', authMiddleware, getCaseWithCommits); 

// // List all commits for a specific case
// router.get('/case/:caseId/commits', authMiddleware, listAllCommits); 

// Get commits by their IDs
router.post('/commits/by-ids', authMiddleware, getCommitsByIds); 

module.exports = router;
