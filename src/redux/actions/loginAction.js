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
          toast.success(`Welcome ${res.data.user}`);
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
