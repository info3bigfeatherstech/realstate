// src/REDUX_FEATURES/REDUX_SLICES/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,           // ✅ ONLY in Redux, not localStorage
    isAuthenticated: false,
    authChecked: false,          // becomes true once bootstrap (refresh+me) completes
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            if (user !== undefined) state.user = user;
            if (accessToken !== undefined) state.accessToken = accessToken;
            state.isAuthenticated = !!state.accessToken;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        setAuthChecked: (state, action) => {
            state.authChecked = action.payload;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
    },
});

export const {
    setCredentials,
    setAccessToken,
    setAuthChecked,
    clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;