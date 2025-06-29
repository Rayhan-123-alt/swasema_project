// routes/dataRoutes.js
import express from 'express';
import SensorData from '../models/sensorData.js';

const router = express.Router();

// GET latest sensor data
router.get('/data', async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ message: 'No sensor data found' });
    }
    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sensor data', error });
  }
});

// (Optional) POST dummy sensor data for testing
router.post('/data', async (req, res) => {
  try {
    const newData = await SensorData.create({
      ph: 6.5,
      tds: 400,
      tempAir: 25.0,
      tempUdara: 27.0,
      humidity: 60,
    });
    res.json({ message: 'Dummy data inserted', data: newData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert dummy data', error });
  }
});

export default router;
