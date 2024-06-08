import { codeExecutionEndpoints } from '../apis';
import { setLoading } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { apiConnector } from '../apiconnector';

export function executeCode(codeData, token) {
    return async (dispatch) => {
        const { code, language, input } = codeData; // Extract relevant fields
        const toastId = toast.loading("Executing Code...");
        dispatch(setLoading(true));

        try {
            // Include the Authorization header with the token
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            console.log(headers);

            const response = await apiConnector("POST", codeExecutionEndpoints.EXECUTE_CODE_API, { code, language, input }, { headers });
            console.log("EXECUTE_CODE_API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Code executed successfully");
            // Handle the response data as needed
            console.log("Execution Result:", response.data.output);
        } catch (error) {
            console.log("EXECUTE_CODE_API ERROR........", error);
            toast.error("Could not execute code");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}