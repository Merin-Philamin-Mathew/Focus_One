import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userLogout, userSignup } from "./userActions";
import { handlePending, handleRejected } from "../utils";

const initialState = {
    accesstoken : '',
    userDetails:'',
    loading: false,
    success: false,
    error: '',
    message: '',
    darkMode: false,
}


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        resetAll: (state)=>{
            state.loading = false;
            state.success = false;
            state.error = '';
        },
        Logout: (state)=>{
            state.loading = false;
            state.success = false;
            state.message= '';
            state.error= '';
            state.accesstoken= '';
            state.darkMode= '';
            state.userDetails= '';
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
            state.pending = false;
        })
        .addCase(userLogout.fulfilled, (state)=>{
            state.success = true;
            state.pending = false;
        })
    }
})

export const {resetAll, toggleDarkMode, Logout} = userSlice.actions;
export default userSlice.reducer;

