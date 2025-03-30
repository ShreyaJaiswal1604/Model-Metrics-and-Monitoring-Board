const mongoose = require('mongoose');

const TrainingResultSchema = new mongoose.Schema({
  failure_probability: Number,
  total_samples: Number,
  anomaly_count: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingResult', TrainingResultSchema);
