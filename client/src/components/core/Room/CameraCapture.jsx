import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { uploadPhotoForCandidate, uploadPhotoForInterviewer } from '../../../services/operations/uploadAPI';

const CameraCapture = ({ onCapture, roomId }) => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const user = useSelector((state) => state.profile.user);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // Cleanup the video stream when the component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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

    const uploadPhoto = async () => {
        const blob = await fetch(capturedImage).then(res => res.blob());

        if (user.accountType === ACCOUNT_TYPE.CANDIDATE) {
            dispatch(uploadPhotoForCandidate(roomId, blob));
        } else {
            dispatch(uploadPhotoForInterviewer(roomId, blob));
        }
    };

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={capturePhoto}>Capture Photo</button>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
            <button onClick={uploadPhoto}>Upload Photo</button>
        </div>
    );
};

export default CameraCapture;