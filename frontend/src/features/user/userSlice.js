import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./userActions";
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


const userSlice = createSlice({
    name: 'user',
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
    extraReducers(builder){
        builder
        .addCase(userLogin.pending, handlePending)
        .addCase(userLogin.rejected, handleRejected)
        .addCase(userLogin.fulfilled, (state, action)=>{
            state.success = true;
            state.loading = false;
            state.userDetails = action?.payload?.data;
        })
    }
})

export const {resetAll, setDarkMode, toggleDarkMode} = userSlice.actions;
export default userSlice.reducer;

