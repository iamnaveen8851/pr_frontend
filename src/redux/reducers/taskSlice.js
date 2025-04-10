import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../actions/taskAction";
import { applyAIPriority } from "../actions/aiPriorityAction";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch tasks";
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create task";
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })

      .addCase(applyAIPriority.fulfilled, (state, action) => {
        const updatedTaskId = action.meta.arg; // Verify taskId is passed as arg
        // console.log(updatedTaskId, "updatedTaskId");
        // Ensure action.payload and action.payload.priority are defined
        if (updatedTaskId && action.payload && action.payload.priority) {
          console.log(action.payload.priority, "priority");
          const updatedPriority = action.payload.priority;

          // const index = state.tasks.findIndex(
          //   (task) => task._id === updatedTaskId
          // );
          // if (index !== -1) {
          //   state.tasks[index].priority = updatedPriority;
          // }

          state.tasks = state.tasks.map((task) => {
            if (task._id === updatedTaskId) {
              return { ...task, priority: updatedPriority };
            }
            return task;
          });
        
        } else {
          console.error(
            "applyAIPriority response does not contain expected data or taskId is missing:",
            action.payload
          );
        }
      });
  },
});

export default taskSlice.reducer;
