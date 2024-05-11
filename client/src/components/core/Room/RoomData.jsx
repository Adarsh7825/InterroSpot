import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../context/DataContext';
import { apiConnector } from '../../../services/apiconnector'; // Ensure this matches the exported function

const RoomData = () => {
    const { setCurrRoom } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector((state) => state.profile);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const token = user?.token;

    function loadingStart() {
        setIsLoading(true);
    }

    function loadingStop() {
        setIsLoading(false);
    }

    useEffect(() => {
        toast.success(`Welcome ${user?.name}!`, {
            position: toast.POSITION.TOP_RIGHT
        });
    }, [user?.name]);

    useEffect(() => {
        if (roomId) {
            joinRoom(roomId);
        }
    }, [roomId]);

    const joinRoom = (roomId) => {
        loadingStart();
        apiConnector('get', `/room/${roomId}`, null, { Authorization: `Bearer ${token}` })
            .then((res) => {
                setCurrRoom(res.data);
                loadingStop();
                navigate('/room');
            })
            .catch((err) => {
                loadingStop();
                toast.error('Room not found', {
                    position: toast.POSITION.TOP_RIGHT
                });
                console.error(err);
            });
    };

};