import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Taskbar from './components/Taskbar';
import Dashboard from './pages/Dashboard'; // Trang Home/Dashboard
import Weather from './pages/Weather'; // Trang Weather (phát triển sau)
import Statistic from './pages/Statistic'; // Trang Statistic (phát triển sau)
import Cost from './pages/Cost'; // Trang Cost (phát triển sau)
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Taskbar */}
        <Taskbar />

        {/* Main content: Routing */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/statistic" element={<Statistic />} />
            <Route path="/cost" element={<Cost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
