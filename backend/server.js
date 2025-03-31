// ------------------------
// Imports and Setup
// ------------------------
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { exec } = require('child_process');
const si = require('systeminformation');
const client = require('prom-client');
const TrainingResult = require('./models/TrainingResult');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// ------------------------
// MongoDB Connection
// ------------------------
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/maintenance';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ------------------------
// Prometheus Setup
// ------------------------
const register = client.register;
client.collectDefaultMetrics(); // Collect default Node.js metrics

// Set default labels for all metrics
const defaultLabels = { serviceName: 'api-v1' };
client.register.setDefaultLabels(defaultLabels);

// Define custom metrics for synthetic data simulation
const gpuTemp = new client.Gauge({
  name: 'gpu_temperature_celsius',
  help: 'Simulated GPU temperature in Celsius',
  labelNames: ['zone', 'node']
});

const cpuTemp = new client.Gauge({
  name: 'cpu_temperature_celsius',
  help: 'Simulated CPU temperature in Celsius',
  labelNames: ['zone', 'node']
});

const simulationCounter = new client.Counter({
  name: 'metric_simulation_runs_total',
  help: 'Total number of simulation intervals run'
});

// Register the custom metrics
register.registerMetric(gpuTemp);
register.registerMetric(cpuTemp);
register.registerMetric(simulationCounter);

// ------------------------
// Simulation Logic
// ------------------------
const zones = ['NorthAmerica', 'Europe', 'Asia'];
const nodesPerZone = 3;
let simulationInterval = null; // Holds the interval ID for simulation

function simulateMetrics() {
  try {
    zones.forEach(zone => {
      for (let i = 1; i <= nodesPerZone; i++) {
        const node = `node-${i}`;
        // Generate synthetic values:
        // GPU temperature between 60°C and 90°C, CPU between 50°C and 75°C
        const gpu = +(Math.random() * 30 + 60).toFixed(2);
        const cpu = +(Math.random() * 25 + 50).toFixed(2);

        gpuTemp.set({ zone, node }, gpu);
        cpuTemp.set({ zone, node }, cpu);

        console.log(`[Simulation] ${zone} - ${node}: GPU ${gpu}°C, CPU ${cpu}°C`);
      }
    });
    simulationCounter.inc();
    console.log(`[Simulation] Metrics updated at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('[Simulation] Error updating metrics:', error);
  }
}

// ------------------------
// Routes
// ------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy!' });
});

// System Stats Endpoint
app.get('/api/system-stats', async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const disk = await si.fsSize();

    res.json({
      cpuUsage: cpu.currentLoad.toFixed(2),
      totalMemory: mem.total,
      usedMemory: mem.used,
      diskUsage: disk.map(d => ({
        filesystem: d.fs,
        size: d.size,
        used: d.used,
        use: d.use
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching system stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trigger ML Model Training
app.post('/api/train', (req, res) => {
  const scriptPath = path.join(__dirname, 'train_model.py');

  exec(`python3 ${scriptPath}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Python error: ${error.message}`);
      return res.status(500).json({ error: 'Training script failed.' });
    }

    try {
      const result = JSON.parse(stdout);
      const saved = await TrainingResult.create(result);
      res.status(200).json(saved);
    } catch (e) {
      console.error('❌ Error saving training result:', e);
      res.status(500).json({ error: 'Failed to process training output.' });
    }
  });
});

// Start Simulation Endpoint
app.post('/start', (req, res) => {
  if (!simulationInterval) {
    simulateMetrics(); // Execute immediately
    simulationInterval = setInterval(simulateMetrics, 5000);
    console.log('✅ Started synthetic metric simulation');
    res.send('Simulation started');
  } else {
    console.log('⚠️ Simulation already running');
    res.send('Simulation already running');
  }
});

// Stop Simulation Endpoint
app.post('/stop', (req, res) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('🛑 Stopped simulation');
    res.send('Simulation stopped');
  } else {
    console.log('⚠️ No simulation was running');
    res.send('Simulation is not running');
  }
});

// Metrics Endpoint for Prometheus Scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ------------------------
// Start Server
// ------------------------
app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
