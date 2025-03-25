import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; // Firebase config import
import { ref, onValue, set } from 'firebase/database'; // Firebase database import
import SensorCard from '../components/SensorCard';
import ControlPanel from '../components/ControlPanel';
import CameraFeed from '../components/Camera';
import EnergyMonitor from '../components/EnergyMonitor';
import Chatbox from '../components/Chatbox'; // Import Chatbox component
import '../Dashboard.css'; // Import CSS file

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    lightIntensity: "--",
    soilMoisture: "--",
    servoAngle: "--",
    waterState: "--",
    irState: "--",
    ldr1Value: "--",
    ldr2Value: "--",
  });

  const deviceStatus = {
    light: false,
    fan: false,
  };

  const [monthlyData, setMonthlyData] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const [isSavingData, setIsSavingData] = useState(false);

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const sensorsRef = ref(database, 'sensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      setSensorData({
        temperature: data?.temperature || "--",
        humidity: data?.humidity || "--",
      });
    });

    return () => unsubscribe();
  }, []);

  // Function to start saving data every 15 seconds
  const startSavingData = () => {
    const newIntervalId = setInterval(() => {
      const currentMonth = new Date().getMonth();
      const newMonthlyData = { ...monthlyData };
      
      if (!newMonthlyData[currentMonth]) {
        newMonthlyData[currentMonth] = { temperature: [], humidity: [] };
      }

      newMonthlyData[currentMonth].temperature.push(sensorData.temperature || 0);
      newMonthlyData[currentMonth].humidity.push(sensorData.humidity || 0);
      setMonthlyData(newMonthlyData);

      // Optionally save data to Firebase
      set(ref(database, 'monthlyData'), newMonthlyData);
    }, 15000); // 15 seconds

    setIntervalId(newIntervalId);
  };

  // Function to stop saving data
  const stopSavingData = () => {
    clearInterval(intervalId); // Stop the interval
    setIntervalId(null); // Clear the interval ID
  };

  // Save the updated monthly data to Firebase when it changes
  useEffect(() => {
    if (Object.keys(monthlyData).length > 0) {
      set(ref(database, 'monthlyData'), monthlyData);
    }
  }, [monthlyData]);

  const toggleDevice = (device) => {
    // Logic for toggling devices (API calls can be added later)
  };

  // Handle Save Data Button click: toggle between start and stop
  const handleSaveDataToggle = () => {
    if (isSavingData) {
      stopSavingData(); // This should stop the saving data process
    } else {
      startSavingData(); // This should start the saving data process
    }
    setIsSavingData(prevState => !prevState); // Properly toggle the state
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
            <SensorCard title="Light Intensity" value={`${sensorData.lightIntensity} lux`} />
            <SensorCard title="Soil Moisture" value={`${sensorData.soilMoisture} %`} />
            <SensorCard title="Servo Angle" value={`${sensorData.servoAngle} °`} />
            <SensorCard title="Water State" value={sensorData.waterState} />
            <SensorCard title="IR State" value={sensorData.irState} />
            <SensorCard title="LDR1 Value" value={sensorData.ldr1Value} />
            <SensorCard title="LDR2 Value" value={sensorData.ldr2Value} />
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
          <button
            className={`save-data-toggle ${isSavingData ? 'active' : ''}`}
            onClick={handleSaveDataToggle}
          >
            {isSavingData ? 'Stop Saving Data' : 'Start Saving Data'}
          </button>
        </div>

        {/* Energy Monitor Block */}
        <div className="dashboard-block">
          <h2 className="block-title">Energy Monitor</h2>
          <EnergyMonitor />
        </div>
      </div>

      {/* Chatbox Component */}
      <Chatbox />
    </div>
  );
};

export default Dashboard;
