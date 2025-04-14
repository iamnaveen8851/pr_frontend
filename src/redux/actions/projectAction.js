import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/projects");
      // console.log("fetch Project", res.data.data);
      // Return the data in the format expected by the reducer
      return { projects: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSingleProject = createAsyncThunk(
  "projects/fetchSingleProject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      console.log("Fetched single project", res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch project");
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    console.log("projectData", projectData);

    try {
      const res = await axiosInstance.post(
        "/projects/createProject",
        projectData
      );
      console.log("Res", res);
      console.log("res of project created...", res.data.data);

      toast.success(`${res.data.message}`);

      return res.data.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/projects/updateProject/${id}`,
        projectData
      );
      toast.success(`${res.data.message}`);
      return res.data;
    } catch (error) {
      toast.error("Failed to update project");
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteTask",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/deleteProject/${id}`);
      toast.success("Project deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
