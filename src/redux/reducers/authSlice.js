import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isSignedUp: false,
  isLoggedIn: false,
  message: "",
  user: null,
  // role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUpRequest: (state) => {
      state.loading = true;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = null;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.isSignedUp = true;
      state.message = action.payload.message;
      state.user = action.payload.user.username;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.message = action.payload.message;
      state.user = action.payload.user;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = null;
      state.user = null;
    },
    signUpError: (state, action) => {
      state.loading = false;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = action.payload;
    },
  },
});

export const {
  signUpRequest,
  signUpSuccess,
  loginRequest,
  loginSuccess,
  logoutSuccess,
  signUpError,
  loginFailure,
} = authSlice.actions;

export default authSlice.reducer;
