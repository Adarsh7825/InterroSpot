import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../context/DataContext';
import { generateFromString } from 'generate-avatar';
import CameraCapture from './CameraCapture';
import { fetchRoom } from '../../../services/operations/roomAPI';
import AceEditor from 'react-ace';

// Import ace builds
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const RoomData = () => {
    const { setCurrRoom, setUser, socket } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const { user } = useSelector((state) => state.profile);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function loadingStart() {
        setIsLoading(true);
    }

    function loadingStop() {
        setIsLoading(false);
    }

    useEffect(() => {
        if (user?.firstName) {
            toast.success(`Welcome ${user.firstName}!`, {
                // position: toast.POSITION.TOP_RIGHT
            });
        }
    }, [user?.firstName]);

    const joinRoom = async (roomId) => {
        if (!capturedPhoto) {
            toast.error('Please capture a photo for validation.');
            return;
        }

        loadingStart();
        try {
            const roomData = dispatch(fetchRoom(roomId, user.token));
            setCurrRoom(roomData);
            socket.emit('joinRoom', { roomId, user });
            navigate(`/room/${roomId}`, { state: { roomid: roomId } });
        } catch (error) {
            toast.error('Room not found', {
                // position: toast.POSITION.TOP_RIGHT
            });
            console.log(error);
        } finally {
            loadingStop();
        }
    };

    useEffect(() => {
        if (user && Array.isArray(user.rooms)) {
            const roomsWithUpdatedAt = user.rooms.filter(room => room.updatedAt);
            if (!roomsWithUpdatedAt.every(room => !room.updatedAt.includes("T"))) {
                roomsWithUpdatedAt.forEach((item) => {
                    let temp = item.updatedAt.replace('T', ' ').split(":");
                    temp.pop();
                    item.updatedAt = temp.join(":");
                });
                roomsWithUpdatedAt.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });

                setUser({ ...user, rooms: roomsWithUpdatedAt });
            }

            document.querySelectorAll(".join-room input").forEach(input => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter")
                        e.target.nextElementSibling.click();
                });
            });
        }

    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#16213E] flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#0F3460]/30 backdrop-blur-lg rounded-2xl border border-[#533483]/20 shadow-xl p-8">
                {/* User Profile Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt='user profile'
                                className="w-24 h-24 rounded-2xl border-2 border-[#E94560] shadow-lg shadow-[#E94560]/30"
                            />
                        ) : (
                            <img
                                src={`data:image/svg+xml;utf8,${generateFromString(user.email + user.name)}`}
                                alt="user profile"
                                className="w-24 h-24 rounded-2xl border-2 border-[#E94560] shadow-lg shadow-[#E94560]/30"
                            />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome, {user.firstName}!
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Please capture your photo to join the room
                    </p>
                </div>

                {/* Camera Section */}
                <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6 border border-[#533483]/30">
                    <CameraCapture
                        onCapture={setCapturedPhoto}
                        roomId={roomId}
                    />
                </div>

                {/* Join Button */}
                <button
                    onClick={() => joinRoom(roomId)}
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#E94560]/50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin">⟳</span>
                            Joining...
                        </>
                    ) : (
                        <>
                            <span>Join Room</span>
                            <span className="transform group-hover:translate-x-1">→</span>
                        </>
                    )}
                </button>

                {/* Room ID Display */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Room ID: <span className="text-[#E94560] font-medium">{roomId}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoomData;