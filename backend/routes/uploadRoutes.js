// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const xlsx = require('xlsx');

const Agent = require('../models/Agent');
const CustomerAssignment = require('../models/CustomerAssignment');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload/customers
router.post(
  '/customers',
  auth,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Validate file type
      const allowedMime = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (!allowedMime.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file format' });
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let rows = xlsx.utils.sheet_to_json(sheet);

      if (!rows.length) {
        return res.status(400).json({ message: 'File is empty' });
      }

      // Validate columns
      const firstRow = rows[0];
      const requiredColumns = ['FirstName', 'Phone', 'Notes'];
      for (const col of requiredColumns) {
        if (!(col in firstRow)) {
          return res
            .status(400)
            .json({ message: `Missing required column: ${col}` });
        }
      }

      const agents = await Agent.find();
      if (agents.length !== 5) {
        return res
          .status(400)
          .json({ message: 'Exactly 5 agents must exist before upload' });
      }

      // Distribution logic
      const total = rows.length;
      const baseCount = Math.floor(total / 5);
      let remainder = total % 5;

      let index = 0;
      let createdDocs = [];

      for (let i = 0; i < agents.length; i++) {
        let countForThisAgent = baseCount;
        if (remainder > 0) {
          countForThisAgent += 1;
          remainder -= 1;
        }

        const slice = rows.slice(index, index + countForThisAgent);
        index += countForThisAgent;

        const docs = slice.map((row) => ({
          agent: agents[i]._id,
          firstName: row.FirstName,
          phone: row.Phone,
          notes: row.Notes || '',
        }));

        if (docs.length) {
          const result = await CustomerAssignment.insertMany(docs);
          createdDocs = createdDocs.concat(result);
        }
      }

      res.json({
        message: 'Customers uploaded and distributed successfully',
        totalAssigned: createdDocs.length,
      });
    } catch (err) {
      console.error('Upload error', err);
      res.status(500).json({
        message: 'File parsing or distribution error',
        error: err.message,
      });
    }
  }
);

module.exports = router;
