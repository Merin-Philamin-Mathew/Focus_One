import { createSlice } from "@reduxjs/toolkit";
import { fetchSearchedHabits } from "./taskActions";
import { handleRejected } from "../utils";

const initialState = {
    accesstoken : '',
    userDetails:'',
    loading: false,
    success: false,
    error: '',
    darkMode: false,
}

const handlePending = (state) => { state.loading = true };


const taskSlice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        resetAll: (state)=>{
            state.loading = false;
            state.success = false;
            state.error = '';
        },
        setDarkMode: (state, action)=>{
            state.darkMode = action.payload;
        },
        toggleDarkMode: (state) =>{
            state.darkMode = !state.darkMode
        }
    },

})

export const {resetAll, setDarkMode, toggleDarkMode} = taskSlice.actions;
export default taskSlice.reducer;

