import { createSlice } from "@reduxjs/toolkit";
import { createHabitAction, createTaskAction, fetchSearchedHabits } from "./taskActions";
import { handlePending, handleRejected } from "../utils";

const initialState = {
    searchedHabits: [],
    selectedHabit: '',
    currentStep: 'create',
    ongoing_task: '',
    subTopic: '',
    estAmountOfWork: '',
    workUnit: '',
    ddd:'',

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
            const response = action?.payload;
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
    },
   

})

export const {resetAll,setSelectedHabit,setCurrentStep,setSubTopicR,setEstAmountOfWorkR,setWorkUnitR,setOngoing_taskR} = taskSlice.actions;
export default taskSlice.reducer;

