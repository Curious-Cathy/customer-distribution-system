// models/Agent.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }, // include country code in string
  password: { type: String, required: true }, // can hash similarly if they also log in later
});

module.exports = mongoose.model('Agent', agentSchema);
