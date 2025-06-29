import express from 'express';
import mqttClient from '../mqtt.js';

const router = express.Router();

// Kirim perintah pompa via MQTT
router.post('/:id/:status', (req, res) => {
  const { id, status } = req.params;

  if (!['A', 'B'].includes(id) || !['on', 'off'].includes(status)) {
    return res.status(400).json({ message: 'Invalid pump ID or status' });
  }

  const topic = `swasema/pump`;
  const payload = JSON.stringify({ id, status });

  mqttClient.publish(topic, payload, () => {
    console.log(`🚀 Published to ${topic}: ${payload}`);
    res.json({ message: `Pump ${id} turned ${status}` });
  });
});

export default router;
