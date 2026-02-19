import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const adminAxiosInstance = axios.create({
  baseURL: API,
});

adminAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminAxiosInstance;
