import axios from "axios";

// Determine which URL to use based on environment
const getBaseURL = () => {
  const isProd = import.meta.env.VITE_ENV === "production";
  console.log(isProd);
  return isProd ? import.meta.env.VITE_PRO_URL : import.meta.env.VITE_DEV_URL;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export { axiosInstance };
