import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

//Register user
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true })

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Log in user
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true })

    if(response.data) { 
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

const getUser = async () => {
    const response = await axios.get(`${API_URL}/users/currentuser`);
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data.data;
};

//Update user
const updateUser = async (userData, userId) => {
    const response = await axios.put(`${API_URL}/users/${userId}/updateuser`, userData, { withCredentials: true })

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Log out user
const logout = () => {
    localStorage.removeItem('user')
    axios.get(`${API_URL}/logout`)
}

//fetch own user posts for profile
const fetchOwnPosts = async() => {
    const response = await axios.get(`${API_URL}/users/getownposts`, { withCredentials: true })
    return response.data
}

const fetchOwnBids = async() => {
    const response = await axios.get(`${API_URL}/users/getownbids`, { withCredentials: true })
    return response.data
}

// Update the user's coins after a successful payment
const updateUserCoins = async (userId, coins) => {
    const response = await axios.patch(`${API_URL}/updateCoins/${userId}`, { coins });
    return response.data;
}


const authService = {
    register,
    login,
    updateUser,
    logout,
    getUser,
    fetchOwnPosts,
    updateUserCoins,
}

export default authService;