// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Taskbar from './components/Taskbar';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Statistic from './pages/Statistic';
import Cost from './pages/Cost';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import SelectDevice from './components/Auth/SelectDevice'; // Import SelectDevice
import { useAuth, AuthProvider } from './context/AuthContext';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-device" element={
              <RequireAuth>
                <SelectDevice />
              </RequireAuth>
            } />
            <Route path="/" element={
              <RequireAuth>
                <div className="main-content"> {/* Add main-content div */}
                  <Taskbar />
                  <Dashboard />
                </div>
              </RequireAuth>
            } />
            <Route path="/weather" element={
              <RequireAuth>
                <div className="main-content"> {/* Add main-content div */}
                  <Taskbar />
                  <Weather />
                </div>
              </RequireAuth>
            } />
            <Route path="/statistic" element={
              <RequireAuth>
                <div className="main-content"> {/* Add main-content div */}
                  <Taskbar />
                  <Statistic />
                </div>
              </RequireAuth>
            } />
            <Route path="/cost" element={
              <RequireAuth>
                <div className="main-content"> {/* Add main-content div */}
                  <Taskbar />
                  <Cost />
                </div>
              </RequireAuth>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;