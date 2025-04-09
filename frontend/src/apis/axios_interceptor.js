import axios from 'axios';
import store from '../store/store';
import { axiosInstance, BASE_URL } from './axios';
import { AUTHENTICATION } from './urls';
import { setAccessToken } from '../features/user/userSlice';

const refreshAxios = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState()?.user?.accesstoken
        if (token){
            config.headers['Authorization']=`Bearer ${token}`
        }
        console.log('token:',token)
        return config
    },
    (error)=>Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await refreshAxios.post(
          `${BASE_URL}${AUTHENTICATION.refresh}`,
          {},
          { withCredentials: true }
        );

        store.dispatch(setAccessToken(data.access));

        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);