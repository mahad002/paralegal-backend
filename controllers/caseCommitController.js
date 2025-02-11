const CaseCommit = require('../models/CaseCommit');
const Case = require('../models/Case');

// Get All Commits for a Specific Case (Paginated)
exports.getCommitsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const commits = await CaseCommit.find({ case: caseId })
      .populate('user', 'name email')
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCommits = await CaseCommit.countDocuments({ case: caseId });

    res.status(200).json({ commits, totalPages: Math.ceil(totalCommits / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Specific Commit by ID
exports.getCommitById = async (req, res) => {
  try {
    const commit = await CaseCommit.findById(req.params.commitId).populate('user', 'name email');

    if (!commit) return res.status(404).json({ error: "Commit not found" });

    res.status(200).json(commit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Commits (Admin)
exports.getAllCommits = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const commits = await CaseCommit.find()
      .populate('case', 'caseTitle caseNumber')
      .populate('user', 'name email')
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCommits = await CaseCommit.countDocuments();

    res.status(200).json({ commits, totalPages: Math.ceil(totalCommits / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a New Commit to a Case
exports.addCommit = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { commitTitle, commitDescription, snapshot } = req.body;

    const lastCommit = await CaseCommit.findOne({ case: caseId }).sort({ _id: -1 });
    const newVersion = lastCommit ? lastCommit.version + 1 : 1;

    const newCommit = new CaseCommit({
      case: caseId,
      user: req.user.id,
      commitTitle,
      commitDescription,
      snapshot,
      version: newVersion
    });

    await newCommit.save();
    await Case.findByIdAndUpdate(caseId, { $push: { commits: newCommit._id } });

    res.status(201).json(newCommit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Revert a Case to a Specific Commit
exports.revertToCommit = async (req, res) => {
  try {
    const { caseId, commitId } = req.params;

    const commit = await CaseCommit.findById(commitId);
    if (!commit) return res.status(404).json({ error: "Commit not found" });

    await Case.findByIdAndUpdate(caseId, commit.snapshot, { new: true });

    res.status(200).json({ message: "Case reverted successfully", commit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Commit (Admin Only)
exports.deleteCommit = async (req, res) => {
  try {
    const { commitId } = req.params;

    const deletedCommit = await CaseCommit.findByIdAndDelete(commitId);
    if (!deletedCommit) return res.status(404).json({ error: "Commit not found" });

    await Case.findByIdAndUpdate(deletedCommit.case, { $pull: { commits: commitId } });

    res.status(200).json({ message: "Commit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
