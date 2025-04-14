import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  signUpError,
  signUpRequest,
  signUpSuccess,
} from "../reducers/authSlice";

export const handleSignUp = createAsyncThunk(
  "auth/signUp",
  async ({ formState, navigate }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(signUpRequest());
      const res = await axiosInstance.post(
        import.meta.env.VITE_SIGNUP,
        formState
      );
      if (res.status === 201) {
        setTimeout(() => {
          toast.success(`${res.data.user.username} Registered Successfully!`);
          dispatch(signUpSuccess(res.data));
          navigate("/login");
        }, 1000);
        return res.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "These Credentials Exists";
      dispatch(signUpError());
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
