// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dataRoutes from './routes/dataRoutes.js';
import pumpRoutes from './routes/pumpRoutes.js';
import './mqtt.js';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/pump', pumpRoutes);
app.use('/api', dataRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/swasema', {
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection failed:', err));