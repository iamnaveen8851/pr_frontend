import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { loginSuccess } from "../reducers/authSlice";

export const handleLogin = createAsyncThunk(
  import.meta.env.VITE_LOGIN,
  async ({ formState, navigate }, { rejectWithValue, dispatch }) => {
    console.log(formState);

    try {
      console.log("API Endpoint:", import.meta.env.VITE_LOGIN); // Log the endpoint
      console.log(formState, "....formState");
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
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success("Login successful");
        navigate("/");
        dispatch(loginSuccess(res.data));

        return res.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
