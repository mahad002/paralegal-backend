const ChatHistory = require('../models/ChatHistory');

// Get Assistance Bot Chats for a Specific Case
exports.getAssistanceChatsByCase = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ caseId: req.params.caseId, botType: 'Assistance' }).populate('userId');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Assistance Bot Chat to a Case
exports.addAssistanceChat = async (req, res) => {
  try {
    const { messages } = req.body;

    const newChat = new ChatHistory({
      caseId: req.params.caseId,
      botType: 'Assistance',
      userId: req.user.id,
      messages
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Compliance Bot Chats for a User
exports.getComplianceChatsByUser = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ userId: req.user.id, botType: 'Compliance' });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Compliance Bot Chat for a User
exports.addComplianceChat = async (req, res) => {
  try {
    const { messages } = req.body;

    const newChat = new ChatHistory({
      botType: 'Compliance',
      userId: req.user.id,
      messages
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
