import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import '../Taskbar.css';

const Taskbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [showDevices, setShowDevices] = useState(false);

    useEffect(() => {
        const fetchDevices = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.id);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setDevices(userData.devices || []);
                } else {
                    setDevices([]);
                    console.log("No such document!");
                }
            }
        };

        fetchDevices();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed: " + error.message);
        }
    };

    const handleDeviceClick = (deviceId) => {
        // Chuyển hướng đến trang dashboard với deviceId
        navigate(`/?deviceId=${deviceId}`);
        // TODO: Cập nhật thông tin về thiết bị đang được chọn trong AuthContext (nếu cần)
        setShowDevices(false); // Ẩn menu sau khi chọn thiết bị
    };

    const handleSwitchDevice = () => {
        setShowDevices(!showDevices); // Toggle the device selection
    };

    return (
        <div className="taskbar">
            <div className="taskbar-links">
              {/* Hide the navigation links on smaller screens */}
              <NavLink to="/" className="taskbar-button desktop-only" activeClassName="active">Home</NavLink>
              <NavLink to="/weather" className="taskbar-button desktop-only" activeClassName="active">Weather</NavLink>
              <NavLink to="/statistic" className="taskbar-button desktop-only" activeClassName="active">Statistic</NavLink>
              <NavLink to="/cost" className="taskbar-button desktop-only" activeClassName="active">Cost</NavLink>
            </div>
            <div className="taskbar-actions">
                <div className="device-menu">
                    <button className="taskbar-button" onClick={handleSwitchDevice}>
                        Switch
                    </button>
                    {showDevices && (
                        <div className="device-list">
                            {devices.map((device) => (
                                <button
                                    key={device.deviceId}
                                    className="device-item"
                                    onClick={() => handleDeviceClick(device.deviceId)}
                                >
                                    {device.deviceName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button className="taskbar-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Taskbar;