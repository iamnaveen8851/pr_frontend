import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PRO_URL, // change url into PRO for deployment
  withCredentials: true,
});

export { axiosInstance };
