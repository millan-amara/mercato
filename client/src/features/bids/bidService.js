import axios from "axios"

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = '/api';

const getBids = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}/bids`);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('User is not authorized');
        } else {
          console.error('An error occurred', error);
        }
      }
}

const createBid = async (bidData) => {
    const postId = bidData.get('postId');
    const response = await axios.post(API_URL + "/posts/" + postId + '/bids', bidData)
    return response.data
}

const bidService = {
    getBids,
    createBid
}

export default bidService