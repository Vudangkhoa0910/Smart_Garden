import React from 'react';
import '../ControlPanel.css';

const ControlPanel = ({ devices, onToggleDevice }) => {
  return (
    <div className="control-panel">
      <h3>Device Controls</h3>
      <div className="control-buttons">
        {Object.keys(devices).map((device) => (
          <button
            key={device}
            className={devices[device] ? 'active' : ''}
            onClick={() => onToggleDevice(device)}
          >
            {device.toUpperCase()} {devices[device] ? 'ON' : 'OFF'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;