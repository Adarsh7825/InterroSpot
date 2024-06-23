import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { createRoomAPI } from '../../../services/operations/CreateRoomAPI';

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const handleCreateRoom = async () => {
        if (!roomName) {
            toast.error('Please enter room name');
            return;
        }
        dispatch(createRoomAPI(roomName, user.token, navigate));
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                <h2 className="text-3xl mb-6 text-white font-extrabold text-center">Create a Room</h2>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="w-full p-3 mb-6 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleCreateRoom}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                >
                    Create Room
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;