const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatHistoryController = require('../controllers/chatHistoryController');

// Assistance Bot Chat History
router.get('/assistance/:caseId', auth, chatHistoryController.getAssistanceChatsByCase);
router.post('/assistance/:caseId', auth, chatHistoryController.addAssistanceChat);

// Compliance Bot Chat History
router.get('/compliance', auth, chatHistoryController.getComplianceChatsByUser);
router.post('/compliance', auth, chatHistoryController.addComplianceChat);

module.exports = router;
