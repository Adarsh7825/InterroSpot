import { codeExecutionEndpoints } from '../apis';
import { setLoading } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { apiConnector } from '../apiconnector';

export function executeCode(codeData, setOutput) {
    return async (dispatch) => {
        const { code, language, input } = codeData;
        const toastId = toast.loading("Executing Code...");
        dispatch(setLoading(true));

        try {
            // Include the Authorization header with the token
            const response = await apiConnector("POST", codeExecutionEndpoints.EXECUTE_CODE_API, { code, language, input });
            setOutput(response.data.output);
            console.log("EXECUTE_CODE_API RESPONSE........", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.update(toastId, { render: "Code executed successfully", type: "success", isLoading: false, autoClose: 1000 });
            // Handle the response data as needed
            console.log("Execution Result:", response.data.output);
        } catch (error) {
            console.log("EXECUTE_CODE_API ERROR........", error);
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}