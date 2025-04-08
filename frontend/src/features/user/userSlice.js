import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userSignup } from "./userActions";
import { handleRejected } from "../utils";

const initialState = {
    accesstoken : '',
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

