import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import tasksReducer from "../redux/reducers/taskSlice";
import projectReducer from "../redux/reducers/projectSlice";
import commentReducer from "../redux/reducers/commentSlice";
import notificationReducer from "../redux/reducers/notificationSlice";
import aiPriorityReducer from "../redux/reducers/aiPrioritySlice";
import reportReducer from "../redux/reducers/reportSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    projects: projectReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    aiPriority: aiPriorityReducer,
    reports: reportReducer,
  },
});
