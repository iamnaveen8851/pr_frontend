import { createSlice } from "@reduxjs/toolkit";
import {
  getTeamPerformance,
  getPendingTasks,
  getTimeSpent,
} from "../actions/reportAction";

// Add timeSpent to initialState
const initialState = {
  teamPerformance: [],
  pendingTasks: [],
  timeSpent: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get Team Performance
      .addCase(getTeamPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.teamPerformance = action.payload.data;
      })
      .addCase(getTeamPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Pending Tasks
      .addCase(getPendingTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTasks = action.payload.data;
      })
      .addCase(getPendingTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add cases for getTimeSpent
      .addCase(getTimeSpent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTimeSpent.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSpent = action.payload.data;
      })
      .addCase(getTimeSpent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportErrors } = reportSlice.actions;
export default reportSlice.reducer;
