import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const getTimeSpent = createAsyncThunk(
  "reports/timeSpent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/reports/time-spent`);

      // console.log(res, "res............for apply recommendation");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to apply priority recommendation"
      );
    }
  }
);
export const getPendingTasks = createAsyncThunk(
  "reports/pendingTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/reports/pending-tasks`);

      // console.log(res, "res............for apply recommendation");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to apply priority recommendation"
      );
    }
  }
);
export const getTeamPerformance = createAsyncThunk(
  "reports/teamPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/reports/team-performance`);

      // console.log(res, "res............for apply recommendation");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to apply priority recommendation"
      );
    }
  }
);
