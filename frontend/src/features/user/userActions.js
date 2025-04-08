import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import { AUTHENTICATION, TASK_URLS } from "../../apis/urls";

export const userLogin = createAsyncThunk('userLogin', async (data, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.post(AUTHENTICATION.login, data)
        console.log(response.data, 'response login')
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

export const userSignup = createAsyncThunk('userSignup', async (data, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.post(AUTHENTICATION.register, data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

