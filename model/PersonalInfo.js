const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Unique for each user
  name: { type: String, required: true },
  job: { type: String, required: true },
  add: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mob: { type: String, required: true },
  link: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
