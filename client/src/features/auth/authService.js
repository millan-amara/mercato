import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = '/api';

//Register user
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Log in user
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Update user
const updateUser = async (userData, userId) => {
    const response = await axios.put(`${API_URL}/users/${userId}/updateuser`, userData)

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
    const response = await axios.get(`${API_URL}/users/getownposts`)
    return response.data
}

const fetchOwnBids = async() => {
    const response = await axios.get(`${API_URL}/users/getownbids`)
    return response.data
}

const authService = {
    register,
    login,
    updateUser,
    logout,
    fetchOwnPosts
}

export default authService;