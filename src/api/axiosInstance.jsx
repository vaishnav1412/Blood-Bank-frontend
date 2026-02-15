import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
});

/* ================================
   ✅ Request Interceptor
   Attach token automatically
================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================================
   ✅ Response Interceptor
   Handle expired session safely
================================ */
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    // If token expired or unauthorized
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("donor");

      // 🚫 Do NOT redirect automatically here
      // Redirect must be handled only in ProtectedRoute
      console.warn("Session expired. Please login again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
