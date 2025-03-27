import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/tasks");
      console.log("fetch Tasks", res.data.data);
      // Return the data in the format expected by the reducer
      return { tasks: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    // console.log("taskData", taskData);
    try {
      const res = await axiosInstance.post("/tasks/createTask", taskData);
      console.log("res of task created...", res.data.task);

      return res.data.task;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/tasks/updateTask/${id}`,
        taskData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/tasks/updateTask/${taskId}`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/deleteTask/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
