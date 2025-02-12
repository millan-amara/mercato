import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const createPost = async (postData) => {
    const response = await axios.post(API_URL, postData)
    return response.data
}

// Serve all posts
const servePosts = async () => {
    const response = await axios.get(`${API_URL}/posts/fetchposts`)
    return response.data
}

// Go to specific post's show page

const showPost = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}`);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('User is not authorized');
        } else {
          console.error('An error occurred', error);
        }
      }
      
    // const response = await axios.get(API_URL + "/posts/" + postId)
    // console.log(response)
    // return response.data
}

// RESETTTTTTTTTTTTTTTT WHEN WE LEAVE


// // Close post / update post

// const closepost = async (postId, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`
//         },
//     }
// //second argument is the data
//     const response = await axios.put(API_URL + postId, {status: 'closed'}, config)
//     return response.data
// }


const postService = {
    createPost,
    servePosts,
    showPost,
}

export default postService