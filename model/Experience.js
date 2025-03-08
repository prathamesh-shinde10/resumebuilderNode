const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  comp: { type: String, required: true },
  job: { type: String, required: true }, 
  adr: { type: String, required: true },
  Start: { type: String, required: true },
  end: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
