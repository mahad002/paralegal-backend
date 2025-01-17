const express = require('express');
const multiparty = require('multiparty');
const s3Controller = require('../controllers/s3Controller');

const router = express.Router();

// Middleware to parse form data
const parseForm = (req, res, next) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Invalid form data' });
        }
        req.fields = fields;
        req.files = files;
        next();
    });
};

// Define routes
router.post('/upload', parseForm, s3Controller.uploadFiles);
router.delete('/delete', s3Controller.deleteFile);

module.exports = router;
