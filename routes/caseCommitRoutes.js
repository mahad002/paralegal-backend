const express = require('express');
const router = express.Router();
const caseCommitController = require('../controllers/caseCommitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/case/:caseId', protect, caseCommitController.getCommitsByCase);
router.get('/:commitId', protect, caseCommitController.getCommitById);
router.post('/case/:caseId', protect, caseCommitController.addCommit);
router.post('/revert/:caseId/:commitId', protect, caseCommitController.revertToCommit);
router.get('/', protect, admin, caseCommitController.getAllCommits);
router.delete('/:commitId', protect, admin, caseCommitController.deleteCommit);

module.exports = router;
