// const ChatHistory = require('../models/ChatHistory');

// // Save chat history (Assistance or Compliance Bot)
// exports.saveChatHistory = async (req, res) => {
//     const { caseId, botType, messages } = req.body;

//     try {
//         const newChat = new ChatHistory({
//             caseId,
//             botType,
//             userId: req.user._id,
//             messages
//         });

//         await newChat.save();
//         res.status(201).json({ message: 'Chat history saved', newChat });
//     } catch (error) {
//         res.status(500).json({ message: 'Error saving chat history', error });
//     }
// };

// // Get chat history for a case
// exports.getChatHistoryByCase = async (req, res) => {
//     const { caseId } = req.params;

//     try {
//         const chatHistory = await ChatHistory.find({ caseId }).populate('userId', 'name email');
//         res.status(200).json(chatHistory);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving chat history', error });
//     }
// };

const ChatHistory = require('../models/ChatHistory');

// Create chat history entry
exports.createChatHistory = async (req, res) => {
    const { caseId, botType, userId, messages } = req.body;

    try {
        const chatHistory = new ChatHistory({ caseId, botType, userId, messages });
        await chatHistory.save();

        // Push the chat history into the corresponding Case's chat history
        if (botType === 'Assistance') {
            await Case.findByIdAndUpdate(caseId, { $push: { chatHistoryAssistanceBot: chatHistory._id } });
        } else {
            await Case.findByIdAndUpdate(caseId, { $push: { chatHistoryComplianceBot: chatHistory._id } });
        }

        res.status(201).json(chatHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get chat history for a specific case
exports.getChatHistory = async (req, res) => {
    try {
        const chatHistories = await ChatHistory.find({ caseId: req.params.caseId }).populate('userId');
        res.json(chatHistories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
