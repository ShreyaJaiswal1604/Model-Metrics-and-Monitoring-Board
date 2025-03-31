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
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ------------------------
// Prometheus Setup
// ------------------------
const register = client.register;
client.collectDefaultMetrics();

// Set default labels for all metrics
const defaultLabels = { serviceName: 'api-v1' };
client.register.setDefaultLabels(defaultLabels);

// Custom Metrics for synthetic data simulation
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

// Additional Telemetry Metrics
const gpuUtil = new client.Gauge({
  name: 'gpu_utilization_percentage',
  help: 'Simulated GPU utilization percentage',
  labelNames: ['zone', 'node']
});
const cpuUtil = new client.Gauge({
  name: 'cpu_utilization_percentage',
  help: 'Simulated CPU utilization percentage',
  labelNames: ['zone', 'node']
});
const powerConsumption = new client.Gauge({
  name: 'power_consumption_watts',
  help: 'Simulated power consumption in watts',
  labelNames: ['zone', 'node']
});
const coolingEfficiency = new client.Gauge({
  name: 'cooling_efficiency_index',
  help: 'Simulated cooling efficiency index (lower is better)',
  labelNames: ['zone', 'node']
});

const simulationCounter = new client.Counter({
  name: 'metric_simulation_runs_total',
  help: 'Total number of simulation intervals run'
});

// Register custom metrics
[ gpuTemp, cpuTemp, gpuUtil, cpuUtil, powerConsumption, coolingEfficiency, simulationCounter ]
  .forEach(metric => register.registerMetric(metric));

// ------------------------
// Enhanced Simulation Logic
// ------------------------
const zones = ['NorthAmerica', 'Europe', 'Asia'];
const nodesPerZone = 3;
let simulationInterval = null;

function simulateMetrics() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    // Define peak hours (e.g., 9 AM - 5 PM)
    const isPeakHour = currentHour >= 9 && currentHour < 17;

    zones.forEach(zone => {
      for (let i = 1; i <= nodesPerZone; i++) {
        const node = `node-${i}`;

        // Baseline values (random around a nominal average)
        let baseGpuTemp = Math.random() * 5 + 65; // 65-70°C normally
        let baseCpuTemp = Math.random() * 5 + 55; // 55-60°C normally

        // Adjust baseline for peak hours
        if (isPeakHour) {
          baseGpuTemp += Math.random() * 5; // add up to 5°C extra during peak hours
          baseCpuTemp += Math.random() * 5;
        }

        // Introduce short spike with a 10% chance
        if (Math.random() < 0.1) {
          baseGpuTemp += Math.random() * 15 + 5; // spike by 5-20°C
          baseCpuTemp += Math.random() * 10 + 5; // spike by 5-15°C
        }

        // Simulate additional telemetry
        let baseGpuUtil = Math.random() * 50 + 30; // 30-80%
        let baseCpuUtil = Math.random() * 50 + 30; // 30-80%
        if (Math.random() < 0.1) {  // spike utilization
          baseGpuUtil += Math.random() * 20;
          baseCpuUtil += Math.random() * 20;
        }
        let basePower = Math.random() * 200 + 200; // 200-400 watts
        if (Math.random() < 0.1) {
          basePower += Math.random() * 100; // spike up to 100 watts more
        }
        let baseCooling = Math.random() * 0.5 + 1; // cooling efficiency index between 1.0 and 1.5
        if (baseGpuTemp > 80 || baseCpuTemp > 75) {
          // If temperatures are high, cooling efficiency drops (index increases)
          baseCooling += Math.random() * 0.5;
        }

        // Set metrics with labels
        gpuTemp.set({ zone, node }, Number(baseGpuTemp.toFixed(2)));
        cpuTemp.set({ zone, node }, Number(baseCpuTemp.toFixed(2)));
        gpuUtil.set({ zone, node }, Number(baseGpuUtil.toFixed(2)));
        cpuUtil.set({ zone, node }, Number(baseCpuUtil.toFixed(2)));
        powerConsumption.set({ zone, node }, Number(basePower.toFixed(2)));
        coolingEfficiency.set({ zone, node }, Number(baseCooling.toFixed(2)));

        console.log(
          `[Simulation] ${zone} - ${node}: GPU Temp: ${baseGpuTemp.toFixed(2)}°C, CPU Temp: ${baseCpuTemp.toFixed(2)}°C`
        );
      }
    });
    simulationCounter.inc();
    console.log(`[Simulation] Metrics updated at ${now.toISOString()}`);
  } catch (error) {
    console.error('[Simulation] Error updating metrics:', error);
  }
}

// ------------------------
// Routes (Health, System Stats, ML Training, etc.)
// ------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy!' });
});

// API/Train Endpoint: Execute train_model.py and store result in MongoDB
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
        console.error('❌ Error saving result:', e);
        res.status(500).json({ error: 'Failed to process training output.' });
      }
    });
  });
  

// Start Simulation
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

// Stop Simulation
app.post('/stop', (req, res) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('🛑 Stopped simulation');
    res.send('Simulation stopped');
  } else {
    res.send('Simulation is not running');
  }
});

// Metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// GET endpoint to retrieve recent anomaly detection results
app.get('/api/anomalies', async (req, res) => {
    try {
      // Fetch the latest 10 training results, sorted by timestamp descending.
      const results = await TrainingResult.find().sort({ timestamp: -1 }).limit(10);
      res.json(results);
    } catch (error) {
      console.error('❌ Error fetching anomalies:', error);
      res.status(500).json({ error: error.message });
    }
  });

// ------------------------
// Start Server
// ------------------------
app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
