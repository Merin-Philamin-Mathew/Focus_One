import { createSlice } from "@reduxjs/toolkit";
import { fetchSearchedHabits } from "./taskActions";
import { handlePending, handleRejected } from "../utils";

const initialState = {
    searchedHabits: [],
    selectedHabit: '',

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
        }
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
            
        }

})

export const {resetAll,setSelectedHabit} = taskSlice.actions;
export default taskSlice.reducer;

