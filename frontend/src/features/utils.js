export const handlePending = (state) => {
    state.loading = true;
};

export const handleRejected = (state, action) => {
    state.loading = false;
    state.error = action?.payload;
};