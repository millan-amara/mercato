import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

// Function to get payment status
const getPaymentStatus = async (invoiceId) => {
    const response = await axios.get(`${API_URL}/payments/status/${invoiceId}`, { withCredentials: true });
    return response.data;
};

export default { getPaymentStatus };