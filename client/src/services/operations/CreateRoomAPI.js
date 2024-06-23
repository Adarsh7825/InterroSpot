import { endpoints } from '../apis';
import { apiConnector } from '../apiconnector';
import { setLoading } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const { CREATE_ROOM_API } = endpoints;

export const createRoomAPI = (roomName, token, navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Creating Room...");
        dispatch(setLoading(true));
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            console.log("Headers:", headers);
            console.log("Request Body:", { name: roomName });

            const response = await apiConnector("POST", CREATE_ROOM_API, { name: roomName }, headers);
            console.log("CREATE_ROOM_API API RESPONSE............", response);


            toast.success("Room created successfully");
            console.log("Navigating to:", `/roomdata/${response.data.room.roomid}`);
            navigate(`/roomdata/${response.data.room.roomid}`);
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Could not create room");
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
};
