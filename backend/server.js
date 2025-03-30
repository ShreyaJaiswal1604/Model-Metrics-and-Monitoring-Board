const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const si = require('systeminformation');
const path = require('path');

// Load TrainingResult model
const TrainingResult = require('./models/TrainingResult');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/maintenance';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy!' });
});

// System Resource Metrics
app.get('/api/system-stats', async (req, res) => {
  try {
    const cpuData = await si.currentLoad();
    const memData = await si.mem();
    const diskData = await si.fsSize();

    const response = {
      cpuUsage: cpuData.currentLoad.toFixed(2),
      totalMemory: memData.total,
      usedMemory: memData.used,
      diskUsage: diskData.map(disk => ({
        filesystem: disk.fs,
        size: disk.size,
        used: disk.used,
        use: disk.use
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ML Training Endpoint
app.post('/api/train', (req, res) => {
  const scriptPath = path.join(__dirname, 'train_model.py');

  exec(`python3 ${scriptPath}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error executing Python script: ${error.message}`);
      return res.status(500).json({ error: 'Failed to execute training script.' });
    }

    try {
      const result = JSON.parse(stdout);

      // ✅ Save result and return full document (with created_at, _id, etc.)
      const savedResult = await TrainingResult.create(result);

      res.status(200).json(savedResult);
    } catch (e) {
      console.error('❌ Error parsing or saving training result:', e);
      res.status(500).json({ error: 'Failed to process training output' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
