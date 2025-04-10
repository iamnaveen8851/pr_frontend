import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

// Get comments for a task or project
export const getComments = createAsyncThunk(
  "comments/getComments",
  async ({ taskId, projectId }, { rejectWithValue }) => {
    try {
      let url = "/comments";
      if (taskId) {
        url += `?taskId=${taskId}`;
      } else if (projectId) {
        url += `?projectId=${projectId}`;
      }

      const response = await axiosInstance.get(url);
      
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch comments";
      return rejectWithValue(message);
    }
  }
);

// Create a new comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/comments/createComment",
        commentData
      );
      console.log(response.data.data, "res....");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add comment";
      return rejectWithValue(message);
    }
  }
);
