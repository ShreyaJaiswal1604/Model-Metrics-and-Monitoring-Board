// test/server.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Connect to a test database before running tests
beforeAll(async () => {
  await mongoose.connect('mongodb://mongo:27017/ml_metrics_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Close the connection after tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Backend API Endpoints', () => {
  it('should start simulation and return dummy metrics', async () => {
    const res = await request(app).post('/api/start');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Simulation started');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBe(10);
  });

  it('should get metrics from the database', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    if (res.body.length > 0) {
      expect(res.body[0].epoch).toEqual(1);
    }
  });
});
