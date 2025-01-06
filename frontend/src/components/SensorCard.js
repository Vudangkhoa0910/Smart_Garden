import React from 'react';
import '../SensorCard.css';

const SensorCard = ({ title, value }) => {
  return (
    <div className="sensor-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default SensorCard;
