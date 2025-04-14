import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

// POST - Start
export const startTimeTracking = createAsyncThunk(
  "tasks/startTimeTracking",
  async (taskId, { rejectWithValue }) => {
    console.log("taskId", taskId);

    try {
      const res = await axiosInstance.post(
        `time-tracking/tasks/${taskId}/start`
      );
      console.log("Res  of start time ", res);
      console.log("res of start time created..", res.data.data);

      toast.success(`${res.data.message}`);

      return res.data.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// PATCH - Stop
export const stopTimeTracking = createAsyncThunk(
  "tasks/stopTimeTracking",
  async (entryId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `time-tracking/entries/${entryId}/stop`
      );

      console.log("Stop Time", res.data);
      toast.success(res.data.message);
      return res.data.data || res.data; // depends on your API
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// GET - Fetch all entries
export const getTimeEntries = createAsyncThunk(
  "tasks/getTimeEntries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`time-tracking/entries`);
      return res.data.data; // this is the array of entries
    } catch (error) {
      toast.error("Failed to load time entries");
      return rejectWithValue(error.response.data);
    }
  }
);
