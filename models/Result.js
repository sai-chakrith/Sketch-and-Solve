// models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  username: String,
  question: String,
  caption: String,
  correct: Boolean,
  imageData: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
