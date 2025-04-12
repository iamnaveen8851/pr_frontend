import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from "../reducers/authSlice";

export const handleLogin = createAsyncThunk(
  import.meta.env.VITE_LOGIN,
  async ({ formState, navigate }, { rejectWithValue, dispatch }) => {
    // console.log(formState);

    try {
      dispatch(loginRequest());
      // console.log("API Endpoint:", import.meta.env.VITE_LOGIN); // Log the endpoint
      // console.log(formState, "....formState");
      const res = await axiosInstance.post(
        import.meta.env.VITE_LOGIN,
        formState,
        {
          headers: {
            "Content-Type": "application/json", // Ensure correct headers are set
          },
        }
      );
      if (res.status === 200) {
        setTimeout(() => {
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(loginSuccess(res.data));
          toast.success(`Welcome ${res.data.user}!`);
          navigate("/");
        }, 1000);

        return res.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      dispatch(loginFailure());
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const handleGoogleLogin = createAsyncThunk(
  "users/google-login",
  async ({ credential, clientId, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/google/verify-token",

        {
          credential,
          clientId,
        },
        { withCredentials: true }
      );

      console.log("Res", res);

      if (res.status === 200) {
        setTimeout(() => {
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(loginSuccess(res.data));
          navigate("/");
          // toast.success(`Welcome ${res.data.user}!`);
        }, 800);
      }
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // same one you already use
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        callback: (tokenResponse) => {
          console.log(
            "Google Calendar OAuth Access Token:",
            tokenResponse.access_token
          );
          localStorage.setItem("googleAccessToken", tokenResponse.access_token);
        },
      });

      // console.log("Token Client", tokenClient);

      tokenClient.requestAccessToken();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Google Login failed. Please try again.";
      dispatch(loginFailure());
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const handleGithubLogin = createAsyncThunk(
  "auth/githubLogin",
  async ({ token, user, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post(
        "/auth/github-firebase",
        {
          accessToken: token,
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
        },
        { withCredentials: true }
      );

      console.log("Github login res: ", res);

      if (res.status === 200) {
        setTimeout(() => {
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(loginSuccess(res.data));
          toast.success(`Welcome ${res.data.user}!`);
          navigate("/");
        }, 1000);
        return res.data;
      }
    } catch (error) {
      toast.error(error.message || "GitHub login failed");
      return rejectWithValue(error.message || "GitHub login failed");
    }
  }
);

// export const getUser = createAsyncThunk(
//   "auth/getUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/users/user");
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
