import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from '../../apis/axios'
import { TASK_URLS } from "../../apis/urls";
import { customToast } from "@/components/utils/toasts/Sonner";
import { getRandomMessage, handleApiError } from "../utils";

export const fetchSearchedHabits = createAsyncThunk('fetchSearchedHabits', async (data, {rejectWithValue})=>{
    try{
        console.log('searched habits')
        const response = await axiosInstance.post(TASK_URLS["search-habit"], {"query":data})
        console.log(response.statusText)
        return response.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
      }
})

// Create Habit
export const createHabitAction = createAsyncThunk('createHabitAction', async (data, {rejectWithValue})=>{
    try{
        console.log('createHabit habits',data)
        const response = await axiosInstance.post(TASK_URLS["habit"], data)
        return response.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
      }
})

// ======================================================================
// Create TASK
export const createTaskAction = createAsyncThunk('createTaskAction', async (data, {rejectWithValue})=>{
    try{
        console.log('createTask actions',data)
        const response = await axiosInstance.post(TASK_URLS["task"], data)
        console.log('create TAsl',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
      }
})

// Complete TASK
export const completeTaskAction = createAsyncThunk(
  'completeTaskAction',
  async ({ ongoing_task, data,completedAmount, estAmountOfWork }, { rejectWithValue }) => {
    try {
      

      const response = await axiosInstance.patch(`${TASK_URLS["task"]}${ongoing_task}/`, data);

      let messageType = "full";
      const completed = parseFloat(completedAmount);
      const estimated = parseFloat(estAmountOfWork);

      if (completed < estimated) messageType = "under";
      else if (completed > estimated) messageType = "over";

      const toastMessage = getRandomMessage(messageType);
      customToast.success(toastMessage);

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete TASK
export const deleteTaskAction = createAsyncThunk('deleteTaskAction', async (ongoing_task, {rejectWithValue})=>{
    try{
        console.log('delete Task actions',ongoing_task)
        const response = await axiosInstance.delete(`${TASK_URLS["task"]}${ongoing_task}/`)
        console.log('delete TAsl',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
      }
})

// GET TASKS
export const fetchTaskAction = createAsyncThunk('fetchTaskAction', async (_,{rejectWithValue})=>{
    try{
      console.log('fetch TAsl')
        const response = await axiosInstance.get(`${TASK_URLS["task"]}`)
        console.log('fetch TAsl',response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
      }
})


