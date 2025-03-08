const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model('Summary', SummarySchema);
