const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const caseCommitController = require('../controllers/caseCommitController');

router.get('/:caseId', auth, caseCommitController.getCommitsByCase);
router.post('/:caseId', auth, caseCommitController.addCommit);

module.exports = router;
