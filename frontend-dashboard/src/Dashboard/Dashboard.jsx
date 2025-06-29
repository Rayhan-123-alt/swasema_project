// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    tds: 0,
    ph: 0,
    tempAir: 0,
    tempUdara: 0,
    humidity: 0,
    timestamp: new Date().toISOString(),
  });

  const [selectedParam, setSelectedParam] = useState("ph");
  const [history, setHistory] = useState({
    ph: [],
    tds: [],
    tempAir: [],
    tempUdara: [],
    humidity: [],
    labels: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://192.168.37.23:5000/api/data")
        .then((res) => res.json())
        .then((data) => {
          console.log('📦 Data dari API:', data);  // ← Cek apakah semua field muncul
          setSensorData(data);
          setHistory((prev) => ({
            ...prev,
            ph: [...prev.ph.slice(-9), data.ph],
            tds: [...prev.tds.slice(-9), data.tds],
            tempAir: [...prev.tempAir.slice(-9), data.tempAir],
            tempUdara: [...prev.tempUdara.slice(-9), data.tempUdara],
            humidity: [...prev.humidity.slice(-9), data.humidity],
            labels: [...prev.labels.slice(-9), new Date(data.timestamp).toLocaleTimeString()],
          }));
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  const handleCardClick = (param) => {
    setSelectedParam(param);
  };

  const controlPump = async (id, status) => {
    try {
      await fetch(`http://192.168.37.23:5000/api/pump/${id}/${status}`, {
        method: 'POST',
      });
      alert(`Pompa ${id} ${status}`);
    } catch (err) {
      alert('Gagal kontrol pompa!');
    }
  };



  const getGaugePercent = (param, value) => {
  let min = 1, max = 6;
  switch (param) {
    case "ph":
      min = 4;
      max = 8;
      break;
    case "tds":
      min = 600;
      max = 1400;
      break;
    case "tempAir":
      min = 0;
      max = 80;
      break;
    case "tempUdara":
      min = 0;
      max = 70;
      break;
    case "humidity":
      min = 45;
      max = 93;
      break;
    default:
      min = 0;
      max = 100;
      break;
  }
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
};

  const getStatus = (param, value) => {
    if (param === "ph") {
      if (value < 5.0 || value > 7.0) return "Poor";
      if (value < 5.8 || value > 6.4) return "Fair";
      return "Excellent";
    } else if (param === "tds") {
      if (value < 700 || value > 1300) return "Poor";
      if (value < 800 || value > 1200) return "Fair";
      return "Excellent";
    } else if (param === "tempAir") {
      if (value < 18 || value > 35) return "Poor";
      if (value < 20 || value > 31) return "Fair";
      return "Excellent";
    } else if (param === "tempUdara") {
      if (value < 18 || value > 30) return "Poor";
      if (value < 20 || value > 27) return "Fair";
      return "Excellent";
    } else if (param === "humidity") {
      if (value < 55 || value > 83) return "Poor";
      if (value < 65 || value > 78) return "Fair";
      return "Excellent";
    }
    return "Excellent";
  };

  const renderCard = (param, label, value) => {
    const status = getStatus(param, value);
    const percent = getGaugePercent(param, value);
    const doughnutData = {
      datasets: [
        {
          data: [percent, 1 - percent],
          backgroundColor: [
            status === "Poor"
              ? "#ef4444"
              : status === "Fair"
              ? "#facc15"
              : "#4ade80",
            "#e5e7eb",
          ],
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    };

    return (
      <div
        className={`sensor-card ${selectedParam === param ? "active" : ""}`}
        onClick={() => handleCardClick(param)}
      >
        <h2>{label}</h2>
        <div className="gauge-wrapper">
          <Doughnut data={doughnutData} />
        </div>
        <p>
          {value}{" "}
          {param === "humidity"
            ? "%"
            : param === "tds"
            ? "ppm"
            : param.includes("temp")
            ? "°C"
            : ""}
        </p>
        <div
          className={`status-text ${
            status === "Fair"
              ? "status-fair"
              : status === "Poor"
              ? "status-poor"
              : ""
          }`}
        >
          {status}
        </div>
      </div>
    );
  };

  const chartData = {
    labels: history.labels,
    datasets: [
      {
        label: selectedParam,
        data: history[selectedParam],
        fill: false,
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Swásêmâ Dashboard</h1>
      <p className="timestamp">
        {new Date(sensorData.timestamp).toLocaleString()}
      </p>

      <div className="sensor-grid">
        {renderCard("ph", "pH Air", sensorData.ph)}
        {renderCard("tds", "TDS", sensorData.tds)}
        {renderCard("tempAir", "Suhu Air", sensorData.tempAir)}
        {renderCard("tempUdara", "Temp Udara", sensorData.tempUdara)}
        {renderCard("humidity", "Kelembapan", sensorData.humidity)}
      </div>

      <div className="panel">
        <Line data={chartData} />
      </div>

      <div className="panel control-panel">
        <h2>Kontrol Pompa</h2>
        <div className="button-grid">
          <button onClick={() => controlPump('A', 'on')}>Pompa A ON</button>
          <button onClick={() => controlPump('A', 'off')}>Pompa A OFF</button>
          <button onClick={() => controlPump('B', 'on')}>Pompa B ON</button>
          <button onClick={() => controlPump('B', 'off')}>Pompa B OFF</button>
        </div>
      </div>
    </div>
  );
}
