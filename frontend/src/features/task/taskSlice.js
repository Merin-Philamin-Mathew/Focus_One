// taskSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchCurrentTask, 
  createTask, 
  completeTask, 
  fetchHabits,
  startFocusSession,
  endFocusSession 
} from "./taskActions";
import { handleRejected } from "../utils";

const initialState = {
  currentTask: null,
  habits: [],
  recentTasks: [],
  focusSession: {
    active: false,
    startTime: null,
    sessionId: null,
    totalDuration: 0,
    isPaused: false,
    pauseStartTime: null,
    pausedDuration: 0
  },
  loading: false,
  success: false,
  error: '',
};

const handlePending = (state) => { 
  state.loading = true;
  state.error = '';
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = '';
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    toggleFocusTimer: (state) => {
      if (state.focusSession.active) {
        if (state.focusSession.isPaused) {
          // Resume the timer
          const pauseDuration = Date.now() - state.focusSession.pauseStartTime;
          state.focusSession.isPaused = false;
          state.focusSession.pauseStartTime = null;
          state.focusSession.pausedDuration += pauseDuration;
        } else {
          // Pause the timer
          state.focusSession.isPaused = true;
          state.focusSession.pauseStartTime = Date.now();
        }
      }
    },
    startFocusMode: (state, action) => {
      if (state.currentTask && state.currentTask.id === action.payload.taskId) {
        state.focusSession.active = true;
        state.focusSession.startTime = Date.now();
        state.focusSession.isPaused = false;
        state.focusSession.pauseStartTime = null;
        state.focusSession.pausedDuration = 0;
      }
    },
    exitFocusMode: (state) => {
      // Calculate final duration if needed - could be used to save session duration
      let finalDuration = 0;
      if (state.focusSession.active) {
        const activeTime = state.focusSession.isPaused 
          ? state.focusSession.pauseStartTime - state.focusSession.startTime
          : Date.now() - state.focusSession.startTime;
        
        finalDuration = Math.floor((activeTime - state.focusSession.pausedDuration) / 1000);
        state.focusSession.totalDuration = finalDuration;
      }
      
      // Reset focus session state
      state.focusSession = {
        ...initialState.focusSession,
        totalDuration: finalDuration // Keep the calculated duration
      };
    }
  },
  extraReducers(builder) {
    builder
      // Fetch current task
      .addCase(fetchCurrentTask.pending, handlePending)
      .addCase(fetchCurrentTask.rejected, handleRejected)
      .addCase(fetchCurrentTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTask = action.payload.data;
      })
      
      // Create task
      .addCase(createTask.pending, handlePending)
      .addCase(createTask.rejected, handleRejected)
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTask = action.payload.data;
        // Add to recent tasks if needed
        if (!state.recentTasks.some(task => task.id === action.payload.data.id)) {
          state.recentTasks.unshift(action.payload.data);
          // Keep only the latest 5 tasks
          if (state.recentTasks.length > 5) {
            state.recentTasks.pop();
          }
        }
      })
      
      // Complete task
      .addCase(completeTask.pending, handlePending)
      .addCase(completeTask.rejected, handleRejected)
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTask = null;
        
        // Update task in recent tasks list if it exists there
        const completedTaskIndex = state.recentTasks.findIndex(
          task => task.id === action.payload.data.id
        );
        if (completedTaskIndex >= 0) {
          state.recentTasks[completedTaskIndex] = action.payload.data;
        }
        
        // Exit focus mode if active
        if (state.focusSession.active) {
          state.focusSession = initialState.focusSession;
        }
      })
      
      // Fetch habits
      .addCase(fetchHabits.pending, handlePending)
      .addCase(fetchHabits.rejected, handleRejected)
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.habits = action.payload.data;
      })
      
      // Start focus session
      .addCase(startFocusSession.pending, handlePending)
      .addCase(startFocusSession.rejected, handleRejected)
      .addCase(startFocusSession.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.focusSession.sessionId = action.payload.data.id;
      })
      
      // End focus session
      .addCase(endFocusSession.pending, handlePending)
      .addCase(endFocusSession.rejected, handleRejected)
      .addCase(endFocusSession.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Any additional state updates needed after ending the session
      });
  }
});

export const { 
  resetTaskState, 
  clearCurrentTask, 
  toggleFocusTimer, 
  startFocusMode, 
  exitFocusMode 
} = taskSlice.actions;

export default taskSlice.reducer;