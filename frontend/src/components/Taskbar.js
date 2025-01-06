import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Taskbar.css';

const Taskbar = () => {
  return (
    <div className="taskbar">
      <NavLink to="/" className="taskbar-button" activeClassName="active">Home</NavLink>
      <NavLink to="/weather" className="taskbar-button" activeClassName="active">Weather</NavLink>
      <NavLink to="/statistic" className="taskbar-button" activeClassName="active">Statistic</NavLink>
      <NavLink to="/cost" className="taskbar-button" activeClassName="active">Cost</NavLink>
    </div>
  );
};

export default Taskbar;
