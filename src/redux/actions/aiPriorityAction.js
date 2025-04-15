import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";


export const applyAIPriority = createAsyncThunk(
  "aiPriority/applyRecommendation",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/ai/tasks/${taskId}/apply-priority`
      );

      console.log(res, "res............for apply recommendation");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to apply priority recommendation"
      );
    }
  }
);
