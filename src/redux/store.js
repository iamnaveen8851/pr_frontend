import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import tasksReducer from "../redux/reducers/taskSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});
