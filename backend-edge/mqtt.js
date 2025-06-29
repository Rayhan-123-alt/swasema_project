import mqtt from 'mqtt';
import SensorData from './models/sensorData.js';

const client = mqtt.connect('mqtt://192.168.37.23:1883'); 

client.on('connect', () => {
  console.log('✅ MQTT connected');
  client.subscribe('esp32/sensor');
});

client.on('message', async (topic, message) => {
  if (topic === 'esp32/sensor') {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 MQTT Payload:', data); // ← log data mentah dari ESP32

      // Pastikan semua field dikirim & disimpan
      const newData = {
        ph: data.ph,
        tds: data.tds,
        tempAir: data.suhuAir,
        tempUdara: data.suhuUdara,
        humidity: data.kelembapan,
        timestamp: data.timestamp || new Date()
      };

      await SensorData.create(newData);
      console.log('✅ Sensor data saved:', newData);
    } catch (err) {
      console.error('❌ Failed to save MQTT data:', err);
    }
  }
});

export default client;
