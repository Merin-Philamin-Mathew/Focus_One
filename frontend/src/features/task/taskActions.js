import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import { TASK_URLS } from "../../apis/urls";

export const fetchSearchedHabits = createAsyncThunk('fetchSearchedHabits', async (data, {rejectWithValue})=>{
    try{
        console.log('searched habits')
        const response = await axiosInstance.post(TASK_URLS["search-habit"], {"query":data})
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

