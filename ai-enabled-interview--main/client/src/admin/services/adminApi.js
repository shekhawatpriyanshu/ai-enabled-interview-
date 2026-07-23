import axios from "axios";
import { getBackendUrl } from "../../api/config";

const adminApi = axios.create({
  baseURL: `${getBackendUrl()}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Unauthorized
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;