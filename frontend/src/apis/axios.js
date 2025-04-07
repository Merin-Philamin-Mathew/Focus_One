import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({ 
    baseURL: BASE_URL,
    withCredentials: true 
});

export {BASE_URL, axiosInstance}