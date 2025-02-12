const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const caseNoteController = require('../controllers/caseNoteController');

router.get('/:caseId', auth.protect, caseNoteController.getNotesByCase);
router.get('/note/:id', auth.protect, caseNoteController.getNoteById);
router.post('/:caseId', auth.protect, caseNoteController.addNote);
router.put('/note/:id', auth.protect, caseNoteController.updateNote);
router.delete('/note/:id', auth.protect, caseNoteController.deleteNote);

module.exports = router;
