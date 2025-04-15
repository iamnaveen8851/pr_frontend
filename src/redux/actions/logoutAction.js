import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { logoutSuccess } from "../reducers/authSlice";

export const clearCookie = createAsyncThunk(
  "auth/logout",
  async ({ navigate }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post(`/users/logout`);
      console.log(res, "logout res");
      localStorage.removeItem("accessToken");

      navigate("/login");
      dispatch(logoutSuccess());
    } catch (error) {
      console.log("Error while logging out", error.message);
      return rejectWithValue(error.message);
    }
  }
);
