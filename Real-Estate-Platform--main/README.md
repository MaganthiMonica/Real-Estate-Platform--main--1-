# Real-Estate-Platform-
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parse');
const Property = require('./models/Property'); // Example Mongoose model
const router = express.Router();
const upload = multer();

router.post('/import-properties', upload.single('properties-csv'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'CSV file is missing.' });
  }

  try {
    // Parse CSV buffer to JSON with header row
    const records = await new Promise((resolve, reject) => {
      csvParser.parse(req.file.buffer.toString(), { columns: true, trim: true }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const validRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const title = record.title?.trim();
      const price = parseFloat(record.price);
      const projectId = record.projectId?.trim();

      const errorList = [];
      if (!title) errorList.push('Missing title');
      if (!projectId) errorList.push('Missing projectId');
      if (isNaN(price) || price <= 0) errorList.push('Invalid price');

      if (errorList.length > 0) {
        errors.push({ row: index + 1, errors: errorList });
      } else {
        validRecords.push({ title, price, projectId, brokerId: req.user.id });
      }
    });

    if (validRecords.length > 0) {
      await Property.insertMany(validRecords);
    }

    return res.status(200).json({
      message: 'Import completed',
      inserted: validRecords.length,
      failed: errors.length,
      errorDetails: errors
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ error: 'Failed to import properties.' });
  }
});

module.exports = router;