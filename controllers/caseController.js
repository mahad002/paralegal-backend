const Case = require('../models/Case');
const CaseCommit = require('../models/CaseCommit');
const User = require('../models/User');

// Get All Cases
exports.getAllCases = async (req, res) => {
  try {
    const user = req.user;

    let cases;
    if (user.role === 'admin') {
      cases = await Case.find().populate('creator caseOwner');
    } else if (user.role === 'firm') {
      const firm = await User.findById(user.id).populate('lawyers');
      if (!firm) return res.status(403).json({ message: 'Firm not found' });

      const lawyerIds = firm.lawyers.map((lawyer) => lawyer._id);
      cases = await Case.find({ caseOwner: { $in: lawyerIds } }).populate('creator caseOwner');
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

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
      creator: req.user.id, 
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
    const cases = await Case.find({ creator: userId });

    if (!cases.length) {
      return res.status(200).json({ message: 'No cases found for this user' });
    }

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Cases Associated with Firm's Lawyers
exports.getCasesByFirm = async (req, res) => {
  try {
    const firmId = req.user.id;

    // Ensure the user is a firm
    const firm = await User.findById(firmId).populate('lawyers');
    if (!firm || firm.role !== 'firm') {
      return res.status(403).json({ message: 'Only firms can access their lawyers\' cases.' });
    }

    // Get lawyer IDs associated with the firm
    const lawyerIds = firm.lawyers.map((lawyer) => lawyer._id);

    // Find all cases associated with these lawyers
    const cases = await Case.find({ caseOwner: { $in: lawyerIds } }).populate('creator caseOwner');

    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Case (Create a Commit Before Modifying)
exports.updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const updatedData = req.body;

    const currentCase = await Case.findById(caseId);
    if (!currentCase) return res.status(404).json({ message: 'Case not found' });

    // Save a commit before making changes
    const newCommit = new CaseCommit({
      case: caseId,
      user: req.user.id,
      commitTitle: "Case Update",
      commitDescription: "Updated case details",
      snapshot: currentCase.toObject()
    });

    await newCommit.save();
    await Case.findByIdAndUpdate(caseId, { $push: { commits: newCommit._id } });

    // Apply the update
    const updatedCase = await Case.findByIdAndUpdate(caseId, updatedData, { new: true });

    res.status(200).json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Revert Case to Specific Commit
exports.revertCaseToCommit = async (req, res) => {
  try {
    const { caseId, commitId } = req.params;

    const commit = await CaseCommit.findById(commitId);
    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    await Case.findByIdAndUpdate(caseId, commit.snapshot, { new: true });

    res.status(200).json({ message: "Case reverted successfully", commit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};