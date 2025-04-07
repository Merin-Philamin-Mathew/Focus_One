import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accesstoken : '',
    loading: false,
    success: false,
    error: '',
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
        setDarkMode: (state, action)=>{
            state.darkMode = action.payload;
        },
        toggleDarkMode: (state) =>{
            state.darkMode = !state.darkMode
        }
    },
})

export const {resetAll, setDarkMode, toggleDarkMode} = userSlice.actions;
export default userSlice.reducer;

