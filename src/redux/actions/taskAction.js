import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/tasks");
      // console.log("fetch Tasks", res.data.data);
      // Return the data in the format expected by the reducer
      return { tasks: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue, dispatch }) => {
    console.log("taskData", taskData);

    try {
      const res = await axiosInstance.post("/tasks/createTask", taskData);
      console.log("Res", res);
      console.log("res of task created...", res.data.task);
      toast.success(`${res.data.message}`);
      dispatch(fetchTasks()); // Dispatch fetchTasks action to update the state with the new task

      return res.data.task;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
      console.log("Res", res);
      toast.success(`${res.data.message}`);
      return res.data;
    } catch (error) {
      toast.error("Failed to update task");
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
      toast.success(`${response.data.message}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to update task status");
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/deleteTask/${id}`);
      toast.success("Task deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const assignTask = createAsyncThunk(
  "tasks/assignTask",
  async ({ taskId, userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/task-allocation/${taskId}/allocate`,
        {
          userId,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign task"
      );
    }
  }
);

export const getUsersByAI = createAsyncThunk(
  "tasks/getUsersByAI",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/task-allocation/${taskId}/recommendations`
      );

      console.log("GET RES", res.data);

      toast.success("Users recommended successfully");

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign task"
      );
    }
  }
);
