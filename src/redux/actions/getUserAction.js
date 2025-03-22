import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { loginSuccess } from "../reducers/authSlice";

export const getUsers = createAsyncThunk(
  "/users",
  async (_, { rejectWithValue, dispatch }) => {
    // Remove the destructuring of navigate
    try {
      // console.log("Hi getting users");
      const res = await axiosInstance.get(`/users`);
      // console.log(res, "get users");
      dispatch(loginSuccess(res.data));
      //   navigate("/login");
      return res.data; // Return the data
    } catch (error) {
      console.log("Error while getting users", error.message);
      return rejectWithValue(error.message);
    }
  }
);
