const CaseNote = require('../models/CaseNote');

// Get All Notes for a Specific Case
exports.getNotesByCase = async (req, res) => {
  try {
    const notes = await CaseNote.find({ case: req.params.caseId }).populate('createdBy');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Specific Note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await CaseNote.findById(req.params.id).populate('createdBy');
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a New Note to a Case
exports.addNote = async (req, res) => {
  try {
    const { citations, facts, statutes, precedents, ratio, rulings, context } = req.body;

    const newNote = new CaseNote({
      case: req.params.caseId,
      createdBy: req.user.id,
      citations,
      facts,
      statutes,
      precedents,
      ratio,
      rulings,
      context
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Case Note
exports.updateNote = async (req, res) => {
  try {
    const updatedNote = await CaseNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Case Note
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await CaseNote.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
