import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
