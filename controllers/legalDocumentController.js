// const LegalDocument = require('../models/LegalDocument');

// // Create a new legal document
// exports.createLegalDocument = async (req, res) => {
//     const { title, category, content, references } = req.body;

//     try {
//         const newDocument = new LegalDocument({
//             title,
//             category,
//             content,
//             references
//         });

//         await newDocument.save();
//         res.status(201).json({ message: 'Legal document created', newDocument });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating legal document', error });
//     }
// };

// // Get all legal documents
// exports.getLegalDocuments = async (req, res) => {
//     try {
//         const documents = await LegalDocument.find();
//         res.status(200).json(documents);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving legal documents', error });
//     }
// };

// // Get a single legal document by ID
// exports.getLegalDocumentById = async (req, res) => {
//     const { documentId } = req.params;

//     try {
//         const document = await LegalDocument.findById(documentId);
//         if (!document) {
//             return res.status(404).json({ message: 'Document not found' });
//         }
//         res.status(200).json(document);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving legal document', error });
//     }
// };
