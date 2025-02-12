import axios from "axios"

const API_URL = '/api/posts/'

const getBids = async (postId) => {

    const response = await axios.get(API_URL + postId + '/bids')
    return response.data
}

const createBid = async (bidData) => {
    const postId = bidData.get('postId');
    const response = await axios.post(API_URL + postId + '/bids', bidData)
    return response.data
}

const bidService = {
    getBids,
    createBid
}

export default bidService