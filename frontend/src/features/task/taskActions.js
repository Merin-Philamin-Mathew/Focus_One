// taskActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from '../../apis/axios';
import URLS from "../../apis/urls";

// Fetch current active task for the user
export const fetchCurrentTask = createAsyncThunk(
  'tasks/fetchCurrentTask',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(URLS.TASKS.currentTask);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.TASKS.create, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Mark task as complete
export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async ({ taskId, completionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${URLS.TASKS.base}/${taskId}/complete`, 
        completionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all habits
export const fetchHabits = createAsyncThunk(
  'tasks/fetchHabits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(URLS.HABITS.list);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Start a focus session for a task
export const startFocusSession = createAsyncThunk(
  'tasks/startFocusSession',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${URLS.TASKS.base}/${taskId}/focus`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// End a focus session with duration
export const endFocusSession = createAsyncThunk(
  'tasks/endFocusSession',
  async ({ sessionId, duration }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${URLS.FOCUS_SESSIONS}/${sessionId}`,
        { duration }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);