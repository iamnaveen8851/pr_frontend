import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

export const handleSignUp = createAsyncThunk(
  'auth/signUp',
  async ({ formState, navigate }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(import.meta.env.VITE_SIGNUP, formState);
      if (res.status === 201) {
        toast.success("User registered successfully!");
        navigate("/login");
        return res.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "These Credentials Exists";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
