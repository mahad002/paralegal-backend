const express = require('express');
const router = express.Router();
const caseCommitController = require('../controllers/caseCommitController')
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/case/:caseId', protect, caseCommitController.getCommitsByCase);  // Correctly calling getCommitsByCase
router.get('/:commitId', protect, caseCommitController.getCommitById);        // Correctly calling getCommitById
router.post('/case/:caseId', protect, caseCommitController.addCommit);       // Correctly calling addCommit
router.post('/revert/:caseId/:commitId', protect, caseCommitController.revertToCommit); // Correctly calling revertToCommit
router.get('/', protect, admin, caseCommitController.getAllCommits);          // Correctly calling getAllCommits (Admin only)
router.delete('/:commitId', protect, admin, caseCommitController.deleteCommit); // Correctly calling deleteCommit

module.exports = router;
