import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userSignup } from "./userActions";
import { handleRejected } from "../utils";

const initialState = {
    accesstoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MTQyNjM2LCJpYXQiOjE3NDQxMzkwMzYsImp0aSI6IjVhNDBlMDA0MzYyNzQyNjI5Mjg5NTgzMGI4Yzg0YjYxIiwidXNlcl9pZCI6Mn0.8UKP8S-3Aa5QV0rlzf014_pV8vnNsf5UPSkmhvaKwhE',
    userDetails:'',
    loading: false,
    success: false,
    error: '',
    message: '',
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
        toggleDarkMode: (state) =>{
            state.darkMode = !state.darkMode
        }
    },
    extraReducers(builder){
        builder
        .addCase(userLogin.pending, handlePending)
        .addCase(userLogin.rejected, handleRejected)
        .addCase(userLogin.fulfilled, (state, action)=>{
            const { access, ...user } = action?.payload.data;
            state.success = true;
            state.loading = false;
            state.message = action?.payload?.message
            state.accesstoken = access
            state.userDetails = user
        })
        .addCase(userSignup.pending, handlePending)
        .addCase(userSignup.rejected, handleRejected)
        .addCase(userSignup.fulfilled, (state, action)=>{
            state.success = true;
            state.pending = true;
        })
    }
})

export const {resetAll, toggleDarkMode} = userSlice.actions;
export default userSlice.reducer;

