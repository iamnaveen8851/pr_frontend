import { createSlice } from "@reduxjs/toolkit";

// Load state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
        loading: false,
        isSignedUp: false,
        isLoggedIn: false,
        message: "",
        user: null,
        profilePicture: null,
        token: localStorage.getItem("accessToken") || null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      loading: false,
      isSignedUp: false,
      isLoggedIn: false,
      message: "",
      user: null,
      profilePicture: null,
      token: localStorage.getItem("accessToken") || null,
    };
  }
};

const initialState = loadState();

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
      state.token = action.payload.accessToken;
      state.profilePicture = action.payload.profilePicture;
      
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify({
        loading: false,
        isLoggedIn: true,
        isSignedUp: state.isSignedUp,
        message: action.payload.message,
        user: action.payload.user,
        token: action.payload.accessToken,
        profilePicture: action.payload.profilePicture,
      }));
    },
    
    logoutSuccess: (state) => {
      state.loading = false;
      state.isSignedUp = false;
      state.isLoggedIn = false;
      state.message = null;
      state.user = null;
      state.profilePicture = null;
      state.token = null;
      
      // Clear from localStorage
      localStorage.removeItem('authState');
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
  updateProfilePicture, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
