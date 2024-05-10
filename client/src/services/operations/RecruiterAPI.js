import { recruiterEndpoints } from '../apis';
import { setLoading } from '../../slices/authSlice'
import { toast } from 'react-toastify';
import { apiConnector } from '../apiconnector';

const { CREATE_INTERVIEW_API } = recruiterEndpoints;

export function createInterview(formData, navigate, token) {
    return async (dispatch) => {
        const { company, jobPositions, candidates } = formData; // Extract relevant fields
        const toastId = toast.loading("Creating Interview...");
        dispatch(setLoading(true));

        try {
            // Include the Authorization header with the token
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            console.log(headers)
            const response = await apiConnector("POST", CREATE_INTERVIEW_API, { company, jobPositions, candidates }, headers);
            console.log("CREATE_INTERVIEW_API RESPONSE........", response);
            console.log(response?.data?.success);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Interview created successfully");
            navigate('/'); // Adjust the navigation path as needed
        } catch (error) {
            console.log("CREATE_INTERVIEW_API ERROR........", error);
            toast.error("Could not create interview");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}