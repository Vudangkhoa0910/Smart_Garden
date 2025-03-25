// src/components/QRCodeScanner.js
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './QRCodeScanner.module.css'; // Create a css module file for this component

const QRCodeScanner = ({ onScan }) => {
  const [scanResult, setScanResult] = useState(null);

  const handleError = (error) => {
    console.error(error);
  };

  const handleScan = (result, error) => {
    if (result) {
      setScanResult(result?.text);
      onScan(result?.text);  // Pass the scanned value to the parent component
    }

    if (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.qrScannerContainer}>
      <QrReader
        className={styles.qrReader}
        delay={300}
        onError={handleError}
        onResult={handleScan}
        style={{ width: '100%' }} // Adjust width as needed
      />
      {scanResult && (
        <p className={styles.scanResult}>Scanned: {scanResult}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;