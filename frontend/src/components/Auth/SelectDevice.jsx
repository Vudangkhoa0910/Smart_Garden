// src/components/Auth/SelectDevice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import '../../styles.css';

const SelectDevice = () => {
    const [deviceId, setDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const { user, setIsLoading } = useAuth();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            setIsLoading(true);
            try {
                const userDocRef = doc(db, "users", user.id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setDevices(userData.devices || []);
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.id) {
            fetchDevices();
        }
    }, [user, setIsLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userDocRef = doc(db, "users", user.id);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                const deviceExists = userData.devices && userData.devices.some(device => device => device.deviceId === deviceId);

                if (deviceExists) {
                    alert("This device is already linked to your account.");
                    setIsLoading(false);
                    return;
                }

                await updateDoc(userDocRef, {
                    devices: [...(userData.devices || []), { deviceId: deviceId, deviceName: deviceName }]
                });

                setDevices(prevDevices => [...prevDevices, { deviceId: deviceId, deviceName: deviceName }]);

                navigate('/');
            }
        } catch (error) {
            console.error("Device link failed:", error);
            alert("Device link failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Link Your Smart Garden Device</h2>

            {devices.length > 0 ? (
                <div>
                    <h3>Your Devices:</h3>
                    <ul>
                        {devices.map((device) => (
                            <li key={device.deviceId}>{device.deviceName}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No devices linked to your account.</p>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="deviceId" className="form-label">Device ID:</label>
                    <input
                        type="text"
                        id="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deviceName" className="form-label">Device Name:</label>
                    <input
                        type="text"
                        id="deviceName"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" disabled={setIsLoading} className={`auth-button ${setIsLoading ? 'auth-button-disabled' : ''}`}>
                    {setIsLoading ? "Linking Device..." : "Link Device"}
                </button>
            </form>
        </div>
    );
};

export default SelectDevice;