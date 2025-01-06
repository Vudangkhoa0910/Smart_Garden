import React from 'react';
import SensorCard from '../components/SensorCard';
import ControlPanel from '../components/ControlPanel';
import CameraFeed from '../components/Camera';
import EnergyMonitor from '../components/EnergyMonitor';
import '../Dashboard.css'; // Import CSS file

const Dashboard = () => {
  const sensorData = {
    temperature: "--",
    humidity: "--",
    light: "--",
    airQuality: "--",
  };

  const deviceStatus = {
    light: false,
    fan: false,
  };

  const toggleDevice = (device) => {
    // Logic for toggling devices (API calls can be added later)
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart Greenhouse Dashboard</h1>
      <div className="dashboard-grid">
        {/* Sensor Data Block */}
        <div className="dashboard-block">
          <h2 className="block-title">Sensor Data</h2>
          <div className="sensor-cards">
            <SensorCard title="Temperature" value={`${sensorData.temperature} °C`} />
            <SensorCard title="Humidity" value={`${sensorData.humidity} %`} />
            <SensorCard title="Light" value={`${sensorData.light} lux`} />
            <SensorCard title="Air Quality" value={`${sensorData.airQuality} AQI`} />
          </div>
        </div>

        {/* Camera Feed Block */}
        <div className="dashboard-block">
          <h2 className="block-title">Camera Feed</h2>
          <CameraFeed />
        </div>

        {/* Control Panel Block */}
        <div className="dashboard-block">
          <h2 className="block-title">Control Panel</h2>
          <ControlPanel devices={deviceStatus} onToggleDevice={toggleDevice} />
        </div>

        {/* Energy Monitor Block */}
        <div className="dashboard-block">
          <h2 className="block-title">Energy Monitor</h2>
          <EnergyMonitor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
