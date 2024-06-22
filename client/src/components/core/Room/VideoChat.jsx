import { Peer } from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ACCOUNT_TYPE } from "../../../utils/constants";

const VideoChat = ({ socket, roomid, user, userVideo, closeIt }) => {
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const [isTabActive, setIsTabActive] = useState(true);
    const [isOppositeUserTabActive, setIsOppositeUserTabActive] = useState(true);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const [screen, setScreen] = useState(false);
    const guestName = useRef(null);

    const muteVideo = () => {
        setVideo(!video);
    }

    const muteAudio = () => {
        setAudio(!audio);
    }

    function quitVideoCall() {
        socket.emit("quit-video", { roomId: roomid, peerId });
        closeIt();
        if (peerInstance.current) {
            peerInstance.current.destroy();
        }
        setScreen(false);
    }

    function startCall() {
        socket.emit('Id', { roomid, peerId, name: user.name });
        setScreen(true);
        document.querySelectorAll(".user-video").forEach(video => {
            video.classList.add("active");
        });
        console.log(peerId);
    }

    const call = () => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            userVideo.current.srcObject = mediaStream;
            userVideo.current.play();

            if (remotePeerIdValue) {
                const call = peerInstance.current.call(remotePeerIdValue, mediaStream);

                call.on('stream', (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
                call.on('close', () => {
                    console.log("call closed");
                    userVideo.current.srcObject = null;
                    remoteVideoRef.current.srcObject = null;
                    peerInstance.current.destroy();
                });
            }
        });
    }

    useEffect(() => {
        peerInstance.current = new Peer();

        peerInstance.current.on('open', (id) => {
            setPeerId(id);
        });

        peerInstance.current.on('call', (call) => {
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                userVideo.current.srcObject = mediaStream;
                userVideo.current.play();
                call.answer(mediaStream);
                call.on('stream', function (remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
            });
        });

        socket.on('Id', (id) => {
            console.log(id.peerId);
            setRemotePeerIdValue(id.peerId);
            guestName.current = id.name;
        });

        socket.on('quit-video', (data) => {
            setRemotePeerIdValue('');
            guestName.current = '';
            remoteVideoRef.current.srcObject = null;
            remoteVideoRef.current.pause();
            remoteVideoRef.current.load();
        });

        socket.on('tab-visibility-change', (data) => {
            if (data.roomId === roomid) {
                console.log('Received tab visibility change:', data.isTabActive);
                setIsOppositeUserTabActive(data.isTabActive);
            }
        });

        peerInstance.current.on("close", () => {
            console.log("peer closed");
        });

        return () => {
            if (peerInstance.current) {
                peerInstance.current.destroy();
            }
        };
    }, [roomid]);

    useEffect(() => {
        if (userVideo.current && screen) {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = audio;
        }

        if (userVideo.current && screen) {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = video;
        }
    }, [audio, video]);

    useEffect(() => {
        const user = document.querySelectorAll(".user-video")[1];
        const guest = document.querySelectorAll(".user-video")[0];
        if (screen) {
            if (!remotePeerIdValue) {
                guest.querySelector(".waiting-video").classList.add("active");
                guest.querySelector(".user-name").classList.remove("active");
            } else {
                guest.querySelector(".waiting-video").classList.remove("active");
                guest.querySelector(".user-name").classList.add("active");
            }
            call();
            user.querySelector(".user-name").classList.add("active");
        } else {
            user.classList.remove("active");
            guest.classList.remove("active");
            guest.querySelector(".waiting-video").classList.remove("active");
            guest.querySelector(".user-name").classList.remove("active");
            user.querySelector(".user-name").classList.remove("active");
        }
    }, [remotePeerIdValue, screen]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            const isTabActive = !document.hidden;
            setIsTabActive(isTabActive);
            socket.emit('tab-visibility-change', { roomId: roomid, isTabActive });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [roomid]);

    return (
        <Rnd
            default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
            }}
            minWidth={200}
            minHeight={200}
            bounds="parent"
        >
            <div className="video-chat flex flex-col items-center w-full h-full bg-black bg-opacity-80 rounded-lg p-4">
                {screen && !isOppositeUserTabActive && user.accountType !== ACCOUNT_TYPE.CANDIDATE && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 text-white text-lg font-semibold">
                        user is on another tab
                    </div>
                )}
                <div className="users flex flex-col md:flex-row w-full h-full">
                    <div className="user-video flex flex-col items-center w-full md:w-1/2 h-full">
                        <h1 className={`waiting-video text-center text-gray-500 ${remotePeerIdValue ? 'hidden' : 'block'}`}>Waiting for user to Join</h1>
                        <video ref={remoteVideoRef} className="w-full h-auto" />
                        <h2 className="user-name text-center text-lg font-semibold">{guestName.current}</h2>
                    </div>
                    <div className="user-video relative flex flex-col items-center w-full md:w-1/2 h-full">
                        <video ref={userVideo} muted className="w-full h-auto" />
                        <h2 className="user-name text-center text-lg font-semibold">{user.name}</h2>
                        {peerId && screen && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                <button onClick={muteVideo} className={`p-2 rounded ${video ? "bg-green-500" : "bg-red-500"}`}>
                                    {video ? <i className="fas fa-video text-white"></i> : <i className="fas fa-video-slash"></i>}
                                </button>
                                <button onClick={muteAudio} className={`p-2 rounded ${audio ? "bg-green-500" : "bg-red-500"}`}>
                                    {audio ? <i className="fas fa-microphone text-white"></i> : <i className="fas fa-microphone-slash"></i>}
                                </button>
                                <button onClick={quitVideoCall} className="p-2 rounded bg-red-500">
                                    <i className="fas fa-phone text-white"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {!screen && peerId && (
                    <div className="video-buttons flex space-x-4 mt-4">
                        <button onClick={startCall} className="p-2 rounded bg-blue-500 text-white">Start Call</button>
                    </div>
                )}
                {!peerId && (
                    <h1 className="text-center text-lg font-semibold">Loading</h1>
                )}
            </div>
        </Rnd>
    );
};

export default VideoChat;