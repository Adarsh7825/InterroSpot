import { toast } from "react-toastify";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { ROOM_UPDATE_API, FETCH_ROOM_API, FETCH_QUESTIONS_API,
    FETCH_CANDIDATE_IMAGE_API,
    FETCH_INTERVIEWER_IMAGE_API,
    FETCH_JOB_POSITION_API,
} = endpoints;

export function updateRooms(roomid, code, language, token) {
    return async (dispatch) => {
        // const toastId = toast.loading("Updating room...");
        try {
            const response = await apiConnector("PATCH", ROOM_UPDATE_API, {
                room: {
                    roomid,
                    code,
                    language
                }
            }, {
                'Authorization': `Bearer ${token}`
            });

            console.log("ROOM UPDATE API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            // toast.success("Room updated successfully");
        } catch (error) {
            console.log("ROOM UPDATE API ERROR........", error);
            // toast.error("Could not update room");
        }
        // toast.dismiss(toastId);
    }
}


export function fetchRoom(roomId, token) {
    return async (dispatch) => {
        // const toastId = toast.loading("Loading room data...");
        try {
            const response = await apiConnector("GET", `${FETCH_ROOM_API}?id=${roomId}`, null, {
                'Authorization': `Bearer ${token}`
            });

            console.log("FETCH ROOM API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            // toast.success("Room data fetched successfully");
            return response.data;
        } catch (error) {
            console.log("FETCH ROOM API ERROR........", error);
            // toast.error("Could not fetch room data");
            throw error;
        } finally {
            // toast.dismiss(toastId);
        }
    }
}

export async function fetchQuestions(roomid) {
    try {
        const response = await apiConnector("GET", `${FETCH_QUESTIONS_API}/${roomid}`);
        console.log('Questions:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Error fetching questions');
        throw error;
    }
}

export async function fetchCandidateImage(roomid) {
    try {
        const response = await apiConnector("GET", `${FETCH_CANDIDATE_IMAGE_API}/${roomid}`);
        console.log('Candidate Image URL:', response.data.room.imageUrl);
        return response.data.room.imageUrl;
    } catch (error) {
        console.error('Error fetching candidate image:', error);
        toast.error('Error fetching candidate image');
        throw error;
    }
}

export async function fetchInterviewerImage(roomid) {
    try {
        const response = await apiConnector("GET", `${FETCH_INTERVIEWER_IMAGE_API}/${roomid}`);
        console.log('Interviewer Image URL:', response.data.room.imageUrlforInterviewer);
        return response.data.room.imageUrlforInterviewer;
    } catch (error) {
        console.error('Error fetching interviewer image:', error);
        toast.error('Error fetching interviewer image');
        throw error;
    }
}

export async function fetchJobPosition(roomid) {
    try {
        const response = await apiConnector("GET", `${FETCH_JOB_POSITION_API}/${roomid}`);
        console.log('Job Position:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching job position:', error);
        toast.error('Error fetching job position');
        throw error;
    }
}