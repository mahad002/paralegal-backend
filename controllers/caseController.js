// const Case = require('../models/Case');

// // Create a new case
// exports.createCase = async (req, res) => {
//     const { caseTitle, caseNumber, description, plaintiff, defendant, lawyer, registrar } = req.body;

//     try {
//         const newCase = new Case({
//             caseTitle,
//             caseNumber,
//             description,
//             plaintiff,
//             defendant,
//             lawyer,
//             registrar
//         });

//         await newCase.save();
//         res.status(201).json({ message: 'Case created successfully', newCase });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating case', error });
//     }
// };

// // Get all cases
// exports.getAllCases = async (req, res) => {
//     try {
//         const cases = await Case.find().populate('plaintiff defendant lawyer registrar');
//         res.status(200).json(cases);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving cases', error });
//     }
// };

// // Get a single case by ID
// exports.getCaseById = async (req, res) => {
//     const { caseId } = req.params;

//     try {
//         const caseData = await Case.findById(caseId).populate('plaintiff defendant lawyer registrar');
//         if (!caseData) {
//             return res.status(404).json({ message: 'Case not found' });
//         }
//         res.status(200).json(caseData);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving case', error });
//     }
// };

// // Update a case
// exports.updateCase = async (req, res) => {
//     const { caseId } = req.params;
//     const updates = req.body;

//     try {
//         const updatedCase = await Case.findByIdAndUpdate(caseId, updates, { new: true });
//         if (!updatedCase) {
//             return res.status(404).json({ message: 'Case not found' });
//         }
//         res.status(200).json({ message: 'Case updated successfully', updatedCase });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating case', error });
//     }
// };

const Case = require('../models/Case');

// Create a new case
exports.createCase = async (req, res) => {
    const { caseTitle, caseNumber, description, plaintiff, defendant, lawyer, registrar, documents } = req.body;

    try {
        const newCase = new Case({ caseTitle, caseNumber, description, plaintiff, defendant, lawyer, registrar, documents });
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all cases
exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find().populate('plaintiff defendant lawyer registrar');
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single case by ID
exports.getCaseById = async (req, res) => {
    try {
        const foundCase = await Case.findById(req.params.id).populate('plaintiff defendant lawyer registrar');
        if (!foundCase) return res.status(404).json({ message: 'Case not found' });
        res.json(foundCase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
