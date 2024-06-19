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

    const copyRoomId = (e) => {
        const id = e.target.innerText;
        navigator.clipboard.writeText(id);
        toast.success('Room ID Copied ', {
            // position: toast.POSITION.TOP_RIGHT
        });
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
        <div>
            <div className="room-data text-white">
                <div className="userData">
                    {user.avatar ?
                        <img src={user.avatar} height={100} alt='user profile' style={{ borderRadius: '50%', width: '5rem', height: '5rem' }} />
                        : <img height={100} src={`data:image/svg+xml;utf8,${generateFromString(user.email + user.name)}`} alt="user profile" style={{ borderRadius: '50%', width: '5rem', height: '5rem' }} />
                    }
                </div>
                <div className="join-room">
                    <div>
                        <button onClick={() => joinRoom(roomId)}>Join Room</button>
                    </div>
                </div>
                <CameraCapture onCapture={setCapturedPhoto} roomId={roomId} />
            </div>
        </div>
    );
};

export default RoomData;