const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  qly: { type: String, required: true },
  clg: { type: String, required: true },
  uni: { type: String, required: true },
  compl: { type: String, required: true },
  percentage: { type: Number, required: true }  // percentage: { type: Number, required: true, default: 0 }  
});

module.exports = mongoose.model('Education', educationSchema);
