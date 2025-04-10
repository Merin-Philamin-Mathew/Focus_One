import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import { TASK_URLS } from "../../apis/urls";

export const fetchSearchedHabits = createAsyncThunk('fetchSearchedHabits', async (data, {rejectWithValue})=>{
    try{
        console.log('searched habits')
        const response = await axiosInstance.post(TASK_URLS["search-habit"], {"query":data})
        console.log(response.data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

// Create Habit
export const createHabitAction = createAsyncThunk('createHabitAction', async (data, {rejectWithValue})=>{
    try{
        console.log('createHabit habits',data)
        const response = await axiosInstance.post(TASK_URLS["habit"], data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

// Create Task
export const createTaskAction = createAsyncThunk('createTaskAction', async (data, {rejectWithValue})=>{
    try{
        console.log('createHabit habits',data)
        const response = await axiosInstance.post(TASK_URLS["task"], data)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

