<h1 align="center">🌱 IoT Hydroponic Monitoring & Control Dashboard</h1>
<p align="center">
  Realtime Monitoring | Edge Computing | MQTT | MERN Stack | ESP32
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/yourusername/your-repo/main/assets/iot-hydroponic.gif" alt="IoT Hydroponic Animation" width="600"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/stack-MERN-green?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/MQTT-Eclipse-purple?style=for-the-badge&logo=eclipse-mosquitto"/>
  <img src="https://img.shields.io/badge/ESP32-Microcontroller-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/github/stars/yourusername/your-repo?style=social"/>
</p>

---

## 🌐 Overview

Sistem **IoT Hidroponik** ini dirancang untuk:

✅ Memantau secara realtime:
- 🌡️ Suhu udara
- 💧 Kelembaban udara
- 🌊 Suhu air
- ⚗️ pH larutan
- 💠 TDS larutan nutrisi

✅ Mengontrol pompa nutrisi secara manual via dashboard menggunakan **relay**

📡 Data dikirim via **MQTT** ke broker dan ditangani di **Node.js (Express)** lalu dikirim ke **React.js** frontend

📊 Dashboard menyajikan data dalam grafik dinamis dan kontrol user-friendly.

## 🛠️ Teknologi

| Layer | Tools |
|-------|-------|
| Frontend | React.js + Chart.js + MQTT.js |
| Backend | Node.js + Express.js + Mosca (MQTT Broker) |
| Database | MongoDB |
| Hardware | ESP32 + Sensor DHT22 + pH Sensor + TDS Sensor + Relay |
| Komunikasi | MQTT Protocol |
| Konsep | Edge Computing, Realtime Data, Manual Control |

---

## 📺 Realtime Dashboard Preview

> Berikut tampilan dashboard realtime monitoring:

<p align="center">
  <img src="https://raw.githubusercontent.com/yourusername/your-repo/main/assets/dashboard-preview.gif" width="700" alt="Dashboard Preview">
</p>

---

## ⚙️ Cara Kerja Sistem

```mermaid
graph LR
ESP32 -->|MQTT| Mosquitto_Broker
Mosquitto_Broker -->|Publish Data| Express_Server
Express_Server -->|Store| MongoDB
Express_Server -->|Send to Client| React_Dashboard
React_Dashboard -->|User Control| Express_Server
Express_Server -->|MQTT Command| ESP32
