import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

// export const getTaskPriorityRecommendation = createAsyncThunk(
//   "aiPriority/getRecommendation",
//   async (taskId, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(
//         `/ai/tasks/${taskId}/priority-recommendation`
//       );
//       console.log(res.data, "res............for get recommendation");
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to get priority recommendation"
//       );
//     }
//   }
// );

// export const analyzeTaskPatterns = createAsyncThunk(
//   "aiPriority/getRecommendation",
//   async (taskId, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(`/ai/tasks/analyze-patterns`);
//       console.log(res, "res............for get recommendation");
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to get priority recommendation"
//       );
//     }
//   }
// );

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



