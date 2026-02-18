import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const publicAxios = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});
