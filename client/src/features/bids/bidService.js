import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getBids = async (postId) => {

    const response = await axios.get(API_URL + "/posts" + postId + '/bids')
    return response.data
}

const createBid = async (bidData) => {
    const postId = bidData.get('postId');
    const response = await axios.post(API_URL + "/posts" + postId + '/bids', bidData)
    return response.data
}

const bidService = {
    getBids,
    createBid
}

export default bidService