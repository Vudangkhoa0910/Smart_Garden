import React, { useState, useEffect } from 'react';
import '../EnergyMonitor.css';

const EnergyMonitor = () => {
  const [energyData, setEnergyData] = useState({
    batteryLevel: 80.00,
    solarCharge: 50.00,
    pump: 0.00,
    light: 0.00,
    fan: 0.00,
  });

  // Simulate charging and consumption process
  useEffect(() => {
    const energyInterval = setInterval(() => {
      setEnergyData((prevData) => {
        // Gradually increase battery and solar charge levels
        const newBatteryLevel = Math.min(
          parseFloat((prevData.batteryLevel + 0.05).toFixed(2)),
          100.00
        );
        const newSolarCharge = Math.min(
          parseFloat((prevData.solarCharge + 0.05).toFixed(2)),
          100.00
        );

        // Simulate power consumption for pump, light, and fan
        const newPump = parseFloat((prevData.pump + (Math.random() * 0.02 - 0.01)).toFixed(2));  // Random fluctuation
        const newLight = parseFloat((prevData.light + (Math.random() * 0.02 - 0.01)).toFixed(2));  // Random fluctuation
        const newFan = parseFloat((prevData.fan + (Math.random() * 0.02 - 0.01)).toFixed(2));  // Random fluctuation

        return {
          batteryLevel: newBatteryLevel,
          solarCharge: newSolarCharge,
          pump: Math.max(newPump, 0),  // Ensure value doesn't go below 0
          light: Math.max(newLight, 0),  // Ensure value doesn't go below 0
          fan: Math.max(newFan, 0),  // Ensure value doesn't go below 0
        };
      });
    }, 500); // Update every 500ms for slower effect

    // Cleanup interval when component unmounts
    return () => clearInterval(energyInterval);
  }, []);

  return (
    <div className="energy-monitor">
      <h3>Energy Monitor</h3>

      {/* Battery and Solar Charge Bars */}
      <div className="energy-bar">
        <div
          className="battery-level"
          style={{ width: `${energyData.batteryLevel}%` }}
        >
          Battery: {energyData.batteryLevel}%
        </div>
      </div>
      <div className="energy-bar">
        <div
          className="solar-charge"
          style={{ width: `${energyData.solarCharge}%` }}
        >
          Solar: {energyData.solarCharge}%
        </div>
      </div>

      {/* Power Consumption of Devices */}
      <h4>Power Consumption</h4>
      <div className="device-bar">
        <div className="device">
          Pump: {energyData.pump}W
        </div>
        <div className="device">
          Light: {energyData.light}W
        </div>
        <div className="device">
          Fan: {energyData.fan}W
        </div>
      </div>
    </div>
  );
};

export default EnergyMonitor;
