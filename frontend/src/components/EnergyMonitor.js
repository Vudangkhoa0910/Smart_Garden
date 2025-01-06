import React, { useState } from 'react';
import '../EnergyMonitor.css';

const EnergyMonitor = () => {
  const [energyData] = useState({
    batteryLevel: 80, 
    solarCharge: 50, 
  });

  return (
    <div className="energy-monitor">
      <h3>Energy Monitor</h3>
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
    </div>
  );
};

export default EnergyMonitor;
