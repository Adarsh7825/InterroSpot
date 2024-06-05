import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
            });
    };

    const capturePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        onCapture(imageData);
    };

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={capturePhoto}>Capture Photo</button>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
        </div>
    );
};

export default CameraCapture;