// const express = require('express');
// const { saveChatHistory, getChatHistoryByCase } = require('../controllers/chatController');
// const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// const router = express.Router();

// // Save chat history (for Assistance Bot or Compliance Bot)
// router.post('/:caseId/chat', authMiddleware, saveChatHistory);

// // Get all chat history for a specific case (Assistance Bot)
// router.get('/:caseId/chat', authMiddleware, getChatHistoryByCase);

// module.exports = router;

const express = require('express');
const { createChatHistory, getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth.protect, createChatHistory); // Create chat history entry
router.get('/:caseId', auth.protect, getChatHistory); // Get chat history for a specific case

module.exports = router;
