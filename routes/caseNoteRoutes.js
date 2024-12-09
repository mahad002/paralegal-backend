const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const caseNoteController = require('../controllers/caseNoteController');

router.get('/:caseId', auth, caseNoteController.getNotesByCase);
router.get('/note/:id', auth, caseNoteController.getNoteById);
router.post('/:caseId', auth, caseNoteController.addNote);
router.put('/note/:id', auth, caseNoteController.updateNote);
router.delete('/note/:id', auth, caseNoteController.deleteNote);

module.exports = router;
