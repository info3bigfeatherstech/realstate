import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authChecked: false,
  pendingVerificationEmail: null,
};

const customerAuthSlice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    setCustomerCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user !== undefined) state.user = user;
      if (accessToken !== undefined) state.accessToken = accessToken;
      state.isAuthenticated = !!state.accessToken;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setCustomerAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    setPendingVerificationEmail: (state, action) => {
      state.pendingVerificationEmail = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.pendingVerificationEmail = null;
    },
  },
});

export const {
  setCustomerCredentials,
  setAccessToken,
  setCustomerAuthChecked,
  setPendingVerificationEmail,
  clearCredentials,
} = customerAuthSlice.actions;

export default customerAuthSlice.reducer;
