// mqttBroker.js
import aedes from 'aedes';
import net from 'net';

const PORT = 1883;
const broker = aedes();

// Buat server TCP MQTT
const server = net.createServer(broker.handle);

// Event saat ada client terhubung
broker.on('client', (client) => {
  console.log(`📡 Client connected: ${client.id}`);
});

// Event saat client publish data
broker.on('publish', async (packet, client) => {
  if (client) {
    console.log(`📨 Received from ${client.id}:`, packet.topic, packet.payload.toString());
  }
});

// Start broker
server.listen(PORT, () => {
  console.log(`🚀 MQTT broker started on port ${PORT}`);
});
