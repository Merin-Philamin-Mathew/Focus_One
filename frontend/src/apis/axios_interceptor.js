import store from '../store/store';
import { axiosInstance } from './axios';


axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState()?.user?.accesstoken
        if (token){
            config.headers['Authorization']=`Bearer${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
);