const CaseCommit = require('../models/CaseCommit');
const Case = require('../models/Case');

// Get All Commits for a Specific Case (Paginated)
exports.getCommitsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Fetch commits related to the case, with pagination and sorting
    const commits = await CaseCommit.find({ case: caseId })
      .populate('user', 'name email')
      .sort({ _id: -1 }) // Sort by latest commit first
      .skip((page - 1) * limit) // Pagination logic
      .limit(parseInt(limit)); // Limit the number of commits per page

    const totalCommits = await CaseCommit.countDocuments({ case: caseId });

    res.status(200).json({
      commits,
      totalPages: Math.ceil(totalCommits / limit), // Calculate total pages
    });
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

    // Fetch all commits, with pagination and sorting (admin-only access)
    const commits = await CaseCommit.find()
      .populate('case', 'caseTitle caseNumber') // Include case details
      .populate('user', 'name email') // Include user (creator of commit)
      .sort({ _id: -1 }) // Sort by latest commit first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCommits = await CaseCommit.countDocuments();

    res.status(200).json({
      commits,
      totalPages: Math.ceil(totalCommits / limit), // Calculate total pages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a New Commit to a Case
exports.addCommit = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { commitTitle, commitDescription, snapshot } = req.body;

    // Validate snapshot exists
    if (!snapshot) {
      return res.status(400).json({ error: "Snapshot is required to create a commit" });
    }

    // Get the latest commit version for the case
    const lastCommit = await CaseCommit.findOne({ case: caseId }).sort({ _id: -1 });
    const newVersion = lastCommit ? lastCommit.version + 1 : 1;

    // Create a new commit object
    const newCommit = new CaseCommit({
      case: caseId,
      user: req.user.id,
      commitTitle,
      commitDescription,
      snapshot,
      version: newVersion,
    });

    await newCommit.save(); // Save the new commit

    // Link the new commit to the case
    await Case.findByIdAndUpdate(caseId, { $push: { commits: newCommit._id } });

    res.status(201).json(newCommit); // Return the newly created commit
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

    // Validate snapshot exists
    if (!commit.snapshot) {
      return res.status(400).json({ error: "Snapshot is missing from the commit" });
    }

    // Revert the case to the snapshot stored in the commit
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

    // Find and delete the commit
    const deletedCommit = await CaseCommit.findByIdAndDelete(commitId);
    if (!deletedCommit) return res.status(404).json({ error: "Commit not found" });

    // Remove the commit reference from the case document
    await Case.findByIdAndUpdate(deletedCommit.case, { $pull: { commits: commitId } });

    res.status(200).json({ message: "Commit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
