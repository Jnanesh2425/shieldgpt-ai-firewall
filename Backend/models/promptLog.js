const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    enum: ['SAFE', 'JAILBREAK', 'PROMPT_INJECTION'],
    required: true,
  },
  confidence: {
    type: Number,
    default: 0,
  },
  riskScore: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: ['ALLOWED', 'BLOCKED', 'SANITIZED'],
    required: true,
  },
  response: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Prompt', promptSchema);