import React from 'react';
import '../ControlPanel.css'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFan,
  faLightbulb,
  faWater,
  faCloudRain,
  faBatteryFull,
  faDoorOpen,
  faSnowflake,
} from '@fortawesome/free-solid-svg-icons';

const ControlPanel = ({ devices, onToggleDevice }) => {

  const deviceConfig = {
    coolingSystem: { displayName: "Cooling System", icon: faSnowflake },
    ventilationSystem: { displayName: "Ventilation System", icon: faFan },
    lights: { displayName: "Lights", icon: faLightbulb },
    waterPump: { displayName: "Water Pump", icon: faWater },
    mistSprinkler: { displayName: "Mist Sprinkler", icon: faCloudRain },
    batteryCharger: { displayName: "Battery Charger", icon: faBatteryFull },
    door: { displayName: "Door", icon: faDoorOpen }
  };


  return (
    <div className="control-panel">
      <h3>Device Control</h3>
      <div className="control-buttons">
        {Object.entries(deviceConfig).map(([deviceKey, config]) => {
          const isOn = devices[deviceKey] || false;

          return (
            <div key={deviceKey} className="device-control">
              <label htmlFor={deviceKey}>
                <FontAwesomeIcon icon={config.icon} className="device-icon" />
                {config.displayName}
              </label>
              <button
                id={deviceKey}
                className={`toggle-button ${isOn ? 'active' : ''}`}
                onClick={() => onToggleDevice(deviceKey)}
              >
                {isOn ? 'Off' : 'On'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;