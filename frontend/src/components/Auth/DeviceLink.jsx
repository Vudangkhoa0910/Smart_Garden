import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles.css';
import { ZXingScanner } from 'react-zxing';

const DeviceLink = () => {
    const [deviceId, setDeviceId] = useState('');
    const { linkDevice, isLoading } = useAuth();
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await linkDevice(deviceId);
            navigate('/');
        } catch (error) {
            console.error("Device link failed:", error);
            alert("Device link failed: " + error.message);
        }
    };

    const handleScan = result => {
        if (result) {
            setDeviceId(result.txt);
            setScanning(false);
        }
    };

    const handleError = err => {
        console.error(err);
        setScanError(err);
    };

    const startScan = () => {
        setScanning(true);
        setScanError(null);
    };

    const stopScan = () => {
        setScanning(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">Link Your Smart Garden Device</h2>
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
                         {!scanning && (
                            <button type="button" onClick={startScan} className="qr-button">
                                Start QR Scan
                            </button>
                        )}
                        {scanning && (
                            <div className="qr-reader-container">
                                <ZXingScanner
                                    constraints={{
                                        video: {
                                            facingMode: "environment",
                                        },
                                    }}
                                    onResult={handleScan}
                                    onError={handleError}
                                />
                                <button onClick={stopScan} className="qr-button">Stop Scan</button>
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={isLoading} className={`auth-button ${isLoading ? 'auth-button-disabled' : ''}`}>
                        {isLoading ? 'Linking Device...' : 'Link Device'}
                    </button>
                </form>
                {scanError && <p className="error-message">Error scanning QR code: {scanError.message}</p>}
            </div>
        </div>
    );
};

export default DeviceLink;