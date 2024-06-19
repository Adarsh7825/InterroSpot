import { toast } from "react-toastify";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { UPLOAD_IMAGE_CANDIDATE_API, UPLOAD_IMAGE_INTERVIEWER_API } = endpoints;

export function uploadPhotoForCandidate(roomId, imageBlob) {
    return async (dispatch) => {
        const formData = new FormData();
        formData.append('imageUrl', imageBlob, 'photo.png'); // Ensure the key matches the backend expectation

        const toastId = toast.loading("Uploading photo...");
        try {
            const response = await apiConnector("POST", `${UPLOAD_IMAGE_CANDIDATE_API}/${roomId}`, formData, {
                'Content-Type': 'multipart/form-data',
            });

            console.log("UPLOAD IMAGE CANDIDATE API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Photo uploaded successfully");
        } catch (error) {
            console.log("UPLOAD IMAGE CANDIDATE API ERROR........", error);
            toast.error("Could not upload photo");
        }
        toast.dismiss(toastId);
    }
}

export function uploadPhotoForInterviewer(roomId, imageBlob) {
    return async (dispatch) => {
        const formData = new FormData();
        formData.append('imageUrl', imageBlob, 'photo.png'); // Ensure the key matches the backend expectation

        const toastId = toast.loading("Uploading photo...");
        try {
            const response = await apiConnector("POST", `${UPLOAD_IMAGE_INTERVIEWER_API}/${roomId}`, formData, {
                'Content-Type': 'multipart/form-data',
            });

            console.log("UPLOAD IMAGE INTERVIEWER API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Photo uploaded successfully");
        } catch (error) {
            console.log("UPLOAD IMAGE INTERVIEWER API ERROR........", error);
            toast.error("Could not upload photo");
        }
        toast.dismiss(toastId);
    }
}