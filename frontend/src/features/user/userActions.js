import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import URLS from "../../apis/urls";

export const userLogin = createAsyncThunk('userLogin', async (data, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.post(URLS.AUTHENTICATION.login, data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})