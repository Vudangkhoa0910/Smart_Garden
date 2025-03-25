import React, { useRef, useEffect, useState } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const streamRef = useRef(null); // Lưu trữ stream để dừng khi tắt

  useEffect(() => {
    const getCameraStream = async () => {
      if (!isCameraOn) return;

      try {
        const constraints = {
          video: {
            facingMode: useFrontCamera ? "user" : "environment",
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream; // Lưu stream để tắt khi cần
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    getCameraStream();

    return () => {
      // Cleanup: Dừng stream khi component unmount hoặc camera tắt
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFrontCamera, isCameraOn]); // Chạy lại khi đổi camera hoặc bật/tắt

  return (
    <div className="camera-container">
      {isCameraOn ? (
        <video ref={videoRef} autoPlay playsInline className={isFlipped ? "flipped" : ""} />
      ) : (
        <div className="camera-off">Camera đang tắt</div>
      )}
      <div className="camera-controls">
        <button onClick={() => setIsFlipped(!isFlipped)}>Flip View</button>
        <button onClick={() => setUseFrontCamera(!useFrontCamera)}>Switch Camera</button>
        <button onClick={() => setIsCameraOn(!isCameraOn)}>
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
