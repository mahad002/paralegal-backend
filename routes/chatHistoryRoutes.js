const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatHistoryController = require('../controllers/chatHistoryController');

// Assistance Bot Chat History
router.get('/assistance/:caseId', auth.protect, chatHistoryController.getAssistanceChatsByCase);
router.post('/assistance/:caseId', auth.protect, chatHistoryController.addAssistanceChat);

// Compliance Bot Chat History
router.get('/compliance', auth.protect, chatHistoryController.getComplianceChatsByUser);
router.post('/compliance', auth.protect, chatHistoryController.addComplianceChat);

module.exports = router;
