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
            <div className="video-chat flex flex-col w-full h-full bg-[#1A1A2E]/95 backdrop-blur-lg rounded-xl border border-[#533483]/20 shadow-lg overflow-hidden">
                {screen && !isOppositeUserTabActive && user.accountType !== ACCOUNT_TYPE.CANDIDATE && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A2E]/90 backdrop-blur-sm z-50">
                        <p className="text-[#E94560] text-lg font-medium">User is on another tab</p>
                    </div>
                )}

                <div className="users grid grid-cols-2 gap-2 p-2 w-full h-full relative">
                    <div className="user-video relative rounded-lg overflow-hidden bg-[#0F3460]/30">
                        <h1 className="waiting-video absolute inset-0 flex items-center justify-center text-[#E94560]/70 text-sm">
                            Waiting for user...
                        </h1>
                        <video ref={remoteVideoRef} className="w-full h-full object-cover" />
                        <div className="user-name absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 text-white text-sm">
                            {guestName.current}
                        </div>
                    </div>

                    <div className="user-video relative rounded-lg overflow-hidden bg-[#0F3460]/30">
                        <video ref={userVideo} muted className="w-full h-full object-cover" />
                        <div className="user-name absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 text-white text-sm">
                            {user.name}
                        </div>

                        {peerId && screen && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                <button
                                    onClick={muteVideo}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${video ? "bg-[#E94560]/80 hover:bg-[#E94560]" : "bg-red-500/80 hover:bg-red-500"
                                        }`}
                                >
                                    <i className={`fas fa-video${!video ? '-slash' : ''} text-white text-sm`}></i>
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