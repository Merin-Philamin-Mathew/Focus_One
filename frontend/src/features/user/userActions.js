import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import { AUTHENTICATION } from "../../apis/urls";

export const userLogin = createAsyncThunk('userLogin', async (data, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.post(AUTHENTICATION.login, data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})