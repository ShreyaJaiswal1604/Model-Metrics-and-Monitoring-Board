// Import required modules
const express = require('express');                  // Web framework for API routing
const cors = require('cors');                        // Enable Cross-Origin Resource Sharing
const mongoose = require('mongoose');                // MongoDB ORM
const { exec } = require('child_process');           // Run shell commands (used to execute Python)
const si = require('systeminformation');             // System metrics (CPU, memory, disk)
const path = require('path');                        // Node path utility
const client = require('prom-client');               // Prometheus metrics collector

// Import Mongoose model for storing ML training results
const TrainingResult = require('./models/TrainingResult');

// Initialize Express app and set port
const app = express();
const port = 5001;

// Middleware to allow JSON parsing and cross-origin requests
app.use(cors());
app.use(express.json());

// ----------------------------------------
// 🔗 MongoDB Connection
// ----------------------------------------
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/maintenance';


// Connect to MongoDB with fallback URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------------------------------
// 📊 Prometheus Metrics Setup
// ----------------------------------------

// Create a Prometheus registry to hold custom metrics
const register = new client.Registry();

// Collect default system metrics like memory, CPU, etc.
client.collectDefaultMetrics({ register });

// Define custom Gauge metrics (real numbers that can go up/down)

// GPU temperature metric
const gpuTemp = new client.Gauge({
  name: 'gpu_temperature_celsius',
  help: 'Simulated GPU temperature in Celsius',
  labelNames: ['zone', 'node'] // Labeled by zone and node ID
});

// CPU temperature metric
const cpuTemp = new client.Gauge({
  name: 'cpu_temperature_celsius',
  help: 'Simulated CPU temperature in Celsius',
  labelNames: ['zone', 'node']
});

// Register both metrics
register.registerMetric(gpuTemp);
register.registerMetric(cpuTemp);

// Define zones and how many nodes in each
const zones = ['NorthAmerica', 'Europe', 'Asia'];
const nodesPerZone = 3;

// This function generates random values and updates the metrics
function simulateMetrics() {
  zones.forEach(zone => {
    for (let i = 1; i <= nodesPerZone; i++) {
      const node = `node-${i}`;
      const gpu = +(Math.random() * 30 + 60).toFixed(2);  // Simulate GPU temp: 60–90°C
      const cpu = +(Math.random() * 25 + 50).toFixed(2);  // Simulate CPU temp: 50–75°C

      gpuTemp.set({ zone, node }, gpu); // Set GPU temp
      cpuTemp.set({ zone, node }, cpu); // Set CPU temp
    }
  });
}

// Used to control the simulation loop
let simulationInterval = null;

// ----------------------------------------
// 🚀 API Routes
// ----------------------------------------

// Health check for backend
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy!' });
});

// Fetch real system resource stats using systeminformation
app.get('/api/system-stats', async (req, res) => {
  try {
    const cpuData = await si.currentLoad();         // Get CPU load
    const memData = await si.mem();                 // Get memory usage
    const diskData = await si.fsSize();             // Get disk info

    // Return simplified, structured stats
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

// ML training endpoint — executes Python script
app.post('/api/train', (req, res) => {
  const scriptPath = path.join(__dirname, 'train_model.py'); // Path to training script

  // Execute the Python script using child_process
  exec(`python3 ${scriptPath}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error executing Python script: ${error.message}`);
      return res.status(500).json({ error: 'Failed to execute training script.' });
    }

    try {
      const result = JSON.parse(stdout);                          // Parse result from stdout
      const savedResult = await TrainingResult.create(result);   // Save to MongoDB
      res.status(200).json(savedResult);                          // Return saved result
    } catch (e) {
      console.error('❌ Error parsing or saving training result:', e);
      res.status(500).json({ error: 'Failed to process training output' });
    }
  });
});

// Starts synthetic metric simulation
app.post('/start', (req, res) => {
  if (!simulationInterval) {
    simulateMetrics(); // Run once immediately
    simulationInterval = setInterval(simulateMetrics, 5000); // Then run every 5 seconds
    console.log('✅ Started synthetic metric simulation');
  }
  res.send('Simulation started');
});

// Stops the simulation loop
app.post('/stop', (req, res) => {
  if (simulationInterval) {
    clearInterval(simulationInterval); // Stop the loop
    simulationInterval = null;
    console.log('🛑 Stopped simulation');
  }
  res.send('Simulation stopped');
});

// Prometheus scrapes metrics from this endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);    // Required header
  res.end(await register.metrics());                // Send all registered metrics
});

// Start the Express server
app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
