import { createSlice } from "@reduxjs/toolkit";
import {
  startTimeTracking,
  stopTimeTracking,
  getTimeEntries,
} from "../actions/timeTrackingAction";

const initialState = {
  entries: [],
  activeEntry: null,
  loading: false,
  error: null,
  success: false,
};

const timeTrackingSlice = createSlice({
  name: "timeTracking",
  initialState,
  reducers: {
    clearTimeTrackingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetTimeTracking: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTimeTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(startTimeTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.isActive) {
          state.activeEntry = action.payload;
        } else {
          state.entries.push(action.payload);
        }
      })
      .addCase(startTimeTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(stopTimeTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(stopTimeTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.activeEntry = null;
        const index = state.entries.findIndex(
          (entry) => entry._id === action.payload._id
        );
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(stopTimeTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTimeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getTimeEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        state.error = null;
      })
      .addCase(getTimeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTimeTrackingState, resetTimeTracking } =
  timeTrackingSlice.actions;
export default timeTrackingSlice.reducer;
