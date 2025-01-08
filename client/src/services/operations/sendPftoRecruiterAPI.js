import axios from 'axios';

export async function sendPftoRecruiterAPI(token, roomid, formData) {
    try {
        const response = await axios.post('http://localhost:8181/api/v1/sendpdftorecruiter/send-pdf', roomid, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            console.log('PDF sent successfully:', response.data);
            return response.data;
        } else {
            throw new Error(`Failed to send PDF: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error sending PDF:', error);
        throw error;
    }
}
