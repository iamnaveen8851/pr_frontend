import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (_, { rejectWithValue }) => {
    // console.log("i am api notification api function")
    try {
      // The backend already gets userId from the JWT token, so we don't need to pass it in the query
      const res = await axiosInstance.get(`/notifications`);
      //   console.log("Notifications fetched:", res);
      return res.data.data || [];
    } catch (error) {
      //   console.log("Error fetching notifications:", error.message);
      if (error.response?.status === 404) {
        // Handle "No notifications found" gracefully
        return [];
      }
      // toast.error("Failed to fetch notifications");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      console.log("Hello i am hit by a notification");
      // http://localhost:8080/notifications/<notificationId>/read
      const res = await axiosInstance.patch(
        `/notifications/${notificationId}/read`
      );
      console.log(res.data, "mark as read");
      toast.success("Notification marked as read");
      return notificationId;
    } catch (error) {
      console.log("Error marking notification as read:", error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
