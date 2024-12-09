// const CaseCommit = require('../models/CaseCommit');
// const Case = require('../models/Case');

// // Create a new case commit
// exports.createCommit = async (req, res) => {
//     const { caseId, title, description, time } = req.body;

//     try {
//         const newCommit = new CaseCommit({
//             caseId,
//             title,
//             description,
//             time,
//             userId: req.user._id
//         });

//         await newCommit.save();
//         await Case.findByIdAndUpdate(caseId, { $push: { commits: newCommit._id } });

//         res.status(201).json({ message: 'Commit created successfully', newCommit });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating commit', error });
//     }
// };

// // Get all commits for a case
// exports.getCommitsForCase = async (req, res) => {
//     const { caseId } = req.params;

//     try {
//         const commits = await CaseCommit.find({ caseId }).populate('userId', 'name email');
//         res.status(200).json(commits);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving commits', error });
//     }
// };

// caseCommit.js (controller)
const CaseCommit = require('../models/CaseCommit');
const Case = require('../models/Case');

exports.createCaseCommit = async (req, res) => {
    const { caseId, title, description, time } = req.body;

    if (!caseId || !title || !description || !time) {
        return res.status(400).json({ message: "All fields are required: caseId, title, description, time." });
    }

    try {
        const caseCommit = new CaseCommit({
            caseId,
            title,
            description,
            time,
            userId: req.user.id // Assuming user ID is available from authentication middleware
        });

        const savedCommit = await caseCommit.save();

        // Push the saved commit's ID into the Case's commits array
        await Case.findByIdAndUpdate(caseId, { $push: { commits: savedCommit._id } });

        res.status(201).json({
            message: "Case commit created successfully.",
            commit: savedCommit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // case.js (controller)
// exports.getCaseWithCommits = async (req, res) => {
//     const { caseId } = req.params;

//     try {
//         const caseDetails = await Case.findById(caseId).populate('commits');
//         if (!caseDetails) {
//             return res.status(404).json({ message: "Case not found." });
//         }

//         res.status(200).json(caseDetails);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // case.js (controller)
// exports.listAllCommits = async (req, res) => {
//     const { caseId } = req.params;

//     try {
//         const caseDetails = await Case.findById(caseId).populate('commits');
//         if (!caseDetails) {
//             return res.status(404).json({ message: "Case not found." });
//         }

//         res.status(200).json(caseDetails.commits);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// caseCommit.js (controller)
exports.getCommitsByIds = async (req, res) => {
    const { commitIds } = req.body; // expecting an array of commit IDs

    try {
        const commits = await CaseCommit.find({ '_id': { $in: commitIds } });
        if (!commits.length) {
            return res.status(404).json({ message: "No commits found with the provided IDs." });
        }

        res.status(200).json(commits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

