// models/CustomerAssignment.js
const mongoose = require('mongoose');

const customerAssignmentSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CustomerAssignment', customerAssignmentSchema);
