const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const caseController = require('../controllers/caseController');

router.get('/', auth, caseController.getAllCases);
router.get('/:id', auth, caseController.getCaseById);
router.post('/', auth, caseController.createCase);
router.put('/:id', auth, caseController.updateCase);
router.delete('/:id', auth, caseController.deleteCase);
router.get('/user/:userId', auth, caseController.getCasesByUser);

module.exports = router;