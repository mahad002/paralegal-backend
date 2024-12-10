const Case = require('../models/Case');

// Get All Cases
exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('creator caseOwner');
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Case by ID
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('creator caseOwner');
    if (!caseData) return res.status(404).json({ message: 'Case not found' });

    res.status(200).json(caseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a New Case
exports.createCase = async (req, res) => {
  try {
    const { caseTitle, caseNumber, description, status, creator, caseOwner, parties, documents } = req.body;

    const newCase = new Case({
      caseTitle,
      caseNumber,
      description,
      status,
      creator: req.user.id, // Set the authenticated user as the creator
      caseOwner,
      parties,
      documents,
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Case
exports.updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCase) return res.status(404).json({ message: 'Case not found' });

    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Case
exports.deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) return res.status(404).json({ message: 'Case not found' });

    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Cases by User
exports.getCasesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cases = await Case.find({ user: userId });

    if (!cases.length) {
      return res.status(200).json({ message: 'No cases found for this user' });
    }

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};