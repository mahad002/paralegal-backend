const CaseCommit = require('../models/CaseCommit');

// Get All Commits for a Specific Case
exports.getCommitsByCase = async (req, res) => {
  try {
    const commits = await CaseCommit.find({ case: req.params.caseId }).populate('user', 'name email');
    res.status(200).json(commits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a New Commit to a Case
exports.addCommit = async (req, res) => {
  try {
    const { commitTitle, commitDescription, snapshot } = req.body;

    const newCommit = new CaseCommit({
      case: req.params.caseId,
      user: req.user.id,
      commitTitle,
      commitDescription,
      snapshot,
    });

    await newCommit.save();
    res.status(201).json(newCommit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
