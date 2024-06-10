import { createQuestionEndpoints } from '../apis';
import { setLoading } from '../../slices/authSlice';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';

const { CREATE_QUESTION_API } = createQuestionEndpoints;

export function createQuestion(formData, token, navigate) {
    return async (dispatch) => {
        const { text, mainCategory, subCategory, difficulty, tags } = formData;
        const toastId = toast.loading("Creating Question...");
        dispatch(setLoading(true));

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await apiConnector("POST", CREATE_QUESTION_API, { text, mainCategory, subCategory, difficulty, tags }, headers);
            console.log("CREATE_QUESTION_API API RESPONSE............", response);
            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Question created successfully");
            navigate('/dashboard'); // Adjust the navigation path as needed
        } catch (error) {
            toast.error("Could not create question");
        } finally {
            toast.dismiss(toastId); // Ensure the toast is dismissed properly
            dispatch(setLoading(false));
        }
    };
}