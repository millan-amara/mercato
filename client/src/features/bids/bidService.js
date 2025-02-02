import axios from "axios"

const API_URL = '/api/posts/'

const getBids = async (postId) => {

    const response = await axios.get(API_URL + postId + '/bids')
    return response.data
}

const createBid = async (bidText, postId) => {
    const response = await axios.post(API_URL + postId + '/bids', {text: bidText})
    console.log(`serive bidtext ${bidText}`)
    console.log(`service postId ${postId}`)

    return response.data
}

const bidService = {
    getBids,
    createBid
}

export default bidService