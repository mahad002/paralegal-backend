// const Case = require('../models/Case');

// // Controller to handle document uploads for a case
// exports.uploadCaseDocuments = async (req, res) => {
//     const { caseId } = req.params;
//     try {
//         // Collect the file details
//         const documents = req.files.map(file => ({
//             documentName: file.originalname,
//             documentPath: file.path
//         }));

//         // Update the case by adding the uploaded documents
//         const updatedCase = await Case.findByIdAndUpdate(caseId, { $push: { documents } }, { new: true });
//         if (!updatedCase) {
//             return res.status(404).json({ message: 'Case not found' });
//         }

//         res.status(200).json({ message: 'Documents uploaded successfully', documents });
//     } catch (error) {
//         res.status(500).json({ message: 'Error uploading documents', error });
//     }
// };
