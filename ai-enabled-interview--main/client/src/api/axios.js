import axios from "axios";
import { getBackendUrl } from "./config";

const API = axios.create({
  baseURL: `${getBackendUrl()}/api`,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization =
      `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data &&
      error.response.data.isBlocked
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?blocked=true";
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${getBackendUrl()}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);

          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return API(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;