import axios from 'axios';

let store;

export const setStore = (_store) => {
  store = _store;
};

const BASE_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({ 
    baseURL: BASE_URL,
    withCredentials: true 
});

export {BASE_URL, axiosInstance}

axiosInstance.interceptors.request.use(
    (config) => {

        const state = store.getState();
        const token = state?.user?.accesstoken;
        
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401) {
        // store.dispatch({ type: 'user/logout' });
  
        // // Optional: redirect to login page if using react-router
        // window.location.href = '/signin';
      }
  
      return Promise.reject(error);
    }
  );