import { createSlice } from "@reduxjs/toolkit";
import { applyAIPriority } from "../actions/aiPriorityAction";

const initialState = {
  recommendation: null,
  loading: false,
  error: null,
  applySuccess: false,
  recommendedPriority: null, // Add recommendedPriority to initial state
};

const aiPrioritySlice = createSlice({
  name: "aiPriority",
  initialState,
  reducers: {
    clearRecommendation: (state) => {
      state.recommendation = null;
      state.error = null;
    },
    clearApplyStatus: (state) => {
      state.applySuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // // Get recommendation cases
      // .addCase(getTaskPriorityRecommendation.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getTaskPriorityRecommendation.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.recommendation = action.payload.data;
      //   state.recommendedPriority = action.payload.data.recommendedPriority;
      // })
      // .addCase(getTaskPriorityRecommendation.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload || "Something went wrong";
      // })

      // // Apply recommendation cases
      .addCase(applyAIPriority.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applySuccess = false;
      })
      .addCase(applyAIPriority.fulfilled, (state, action) => {
        state.loading = false;
        state.applySuccess = true;
        state.recommendation = null; // Clear recommendation after applying
        state.recommendedPriority = action.payload.priority;
      })
      .addCase(applyAIPriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.applySuccess = false;
      });
  },
});

export const { clearRecommendation, clearApplyStatus } =
  aiPrioritySlice.actions;
export default aiPrioritySlice.reducer;
