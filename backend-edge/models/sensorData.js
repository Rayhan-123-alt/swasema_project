// models/sensorData.js
import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema({
  ph: Number,
  tds: Number,
  tempAir: Number,
  tempUdara: Number,
  humidity: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SensorData', SensorDataSchema);
