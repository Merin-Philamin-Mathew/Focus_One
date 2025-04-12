import { createSlice } from "@reduxjs/toolkit";
import { completeTaskAction, createHabitAction, createTaskAction, deleteTaskAction, fetchSearchedHabits } from "./taskActions";
import { handlePending, handleRejected } from "../utils";

const initialState = {
    searchedHabits: [],
    selectedHabit: '',
    currentStep: 'create',
    ongoing_task: '',
    subTopic: '',
    estAmountOfWork: '',
    workUnit: '',
    completedAmount:'',
    timerR:{
        seconds: 0,
        minutes: 0,
        hours: 0,
        isRunning: false
      },

    
    loading: false,
    success: false,
    error: '',
    message: '',
}

const taskSlice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        resetAll: (state)=>{
            state.loading = false;
            state.success = false;
            state.error = '';
        },
        resetTaskR: (state)=>{
            state.selectedHabit = '';
            state.currentStep = 'create';
            state.ongoing_task = '';
            state.subTopic = '';
            state.estAmountOfWork = '';
            state.workUnit = '';
            state.completedAmount = '';
            state.timerR={
                seconds: 0,
                minutes: 0,
                hours: 0,
                isRunning: false
              }
        },
        setSelectedHabit: (state,action)=>{            
            state.selectedHabit = action.payload
        },
        setCurrentStep: (state,action)=>{            
            state.currentStep = action.payload
        },
        setSubTopicR: (state,action)=>{            
            state.subTopic = action.payload
        },
        setEstAmountOfWorkR: (state,action)=>{            
            state.estAmountOfWork = action.payload
        },
        setWorkUnitR: (state,action)=>{            
            state.workUnit = action.payload
        },
        setCompletedAmountR: (state,action)=>{            
            state.completedAmount = action.payload
        },
        setTimerR: (state,action)=>{      
            console.log(action.payload)    
            state.timerR = action.payload
        },
    },

    extraReducers(builder){
        builder
        .addCase(fetchSearchedHabits.pending, handlePending)
        .addCase(fetchSearchedHabits.rejected, handleRejected)
        .addCase(fetchSearchedHabits.fulfilled, (state, action)=>{
            const response = action?.payload;
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.searchedHabits= response
        })
        .addCase(createHabitAction.pending, handlePending)
        .addCase(createHabitAction.rejected, handleRejected)
        .addCase(createHabitAction.fulfilled, (state, action)=>{
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.error = action?.payload?.error
        })
        .addCase(createTaskAction.pending, handlePending)
        .addCase(createTaskAction.rejected, handleRejected)
        .addCase(createTaskAction.fulfilled, (state, action)=>{
            const response = action?.payload;
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.error = action?.payload?.error
            state.ongoing_task = response.id
        })
        .addCase(completeTaskAction.pending, handlePending)
        .addCase(completeTaskAction.rejected, handleRejected)
        .addCase(completeTaskAction.fulfilled, (state, action)=>{
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.error = action?.payload?.error
        })
        .addCase(deleteTaskAction.pending, handlePending)
        .addCase(deleteTaskAction.rejected, handleRejected)
        .addCase(deleteTaskAction.fulfilled, (state, action)=>{
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.error = action?.payload?.error
        })
    },
   

})

export const {resetAll,setSelectedHabit,setCurrentStep,setSubTopicR,setEstAmountOfWorkR,setWorkUnitR,setOngoing_taskR,setCompletedAmountR,resetTaskR,setTimerR} = taskSlice.actions;
export default taskSlice.reducer;

