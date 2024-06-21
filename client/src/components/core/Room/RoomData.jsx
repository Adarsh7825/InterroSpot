import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../context/DataContext';
import { generateFromString } from 'generate-avatar';
import CameraCapture from './CameraCapture';
import { fetchRoom } from '../../../services/operations/roomAPI';

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
        if (user && !user.rooms.every(room => !room.updatedAt.includes("T"))) {
            user.rooms.forEach((item) => {
                let temp = item.updatedAt.replace('T', ' ').split(":");
                temp.pop();
                item.updatedAt = temp.join(":");
            });
            user.rooms.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            setUser({ ...user });
        }

        if (user) {
            document.querySelectorAll(".join-room input").forEach(input => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter")
                        e.target.nextElementSibling.click();
                });
            });
        }

    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        {user.avatar ?
                            <img src={user.avatar} alt='user profile' className="rounded-full w-20 h-20" />
                            : <img src={`data:image/svg+xml;utf8,${generateFromString(user.email + user.name)}`} alt="user profile" className="rounded-full w-20 h-20" />
                        }
                    </div>
                    <CameraCapture onCapture={setCapturedPhoto} roomId={roomId} />
                    <button
                        onClick={() => joinRoom(roomId)}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 hover:from-blue-500 hover:via-purple-600 hover:to-pink-700 text-white font-bold rounded"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomData;