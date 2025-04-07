import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accesstoken : '',
    loading: false,
    success: false,
    error: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        resetAll: (state)=>{
            state.loading = false;
            state.success = false;
            state.error = '';
        }
    },
})

export const {resetAll} = userSlice.actions;
export default userSlice.reducer;

