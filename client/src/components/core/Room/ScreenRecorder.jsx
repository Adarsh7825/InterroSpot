import React, { useState, useRef, useEffect } from 'react';

const ScreenRecorder = ({ startRecording, stopRecording }) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);

    useEffect(() => {
        if (startRecording) {
            startRecordingHandler();
        } else if (stopRecording) {
            stopRecordingHandler();
        }
    }, [startRecording, stopRecording]);

    const startRecordingHandler = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'video/webm' });
                chunks.current = [];
                const dataDownloadUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = dataDownloadUrl;
                a.download = 'recording.webm';
                a.click();
                URL.revokeObjectURL(dataDownloadUrl);
            };

            mediaRecorder.current.start(250);
            setRecording(true);
        } catch (err) {
            console.error('Error starting recording: ', err);
        }
    };

    const stopRecordingHandler = () => {
        mediaRecorder.current.stop();
        setRecording(false);
    };

    return null;
};

export default ScreenRecorder;