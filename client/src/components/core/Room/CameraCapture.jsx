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
        startCamera();
        return () => {
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
        uploadPhoto(imageData);
    };

    const uploadPhoto = async (imageData) => {
        const blob = await fetch(imageData).then(res => res.blob());

        if (user.accountType === ACCOUNT_TYPE.CANDIDATE) {
            // dispatch(uploadPhotoForCandidate(roomId, blob));
        } else {
            // dispatch(uploadPhotoForInterviewer(roomId, blob));
        }
    };

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-full rounded-lg mb-4"></video>
            <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                Capture Photo
            </button>
            {capturedImage && <img src={capturedImage} alt="Captured" className="mt-4 rounded-lg" />}
        </div>
    );
};

export default CameraCapture;