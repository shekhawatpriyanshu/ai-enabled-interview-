import axios from "./adminApi";

const API = "/coding";

// Dashboard
export const getDashboardStats = () =>
  axios.get(`${API}/dashboard/stats`);

export const getAnalytics = () =>
  axios.get(`${API}/dashboard/analytics`);

export const getRecentProblems = () =>
  axios.get(`${API}/dashboard/recent-problems`);

export const getRecentSubmissions = () =>
  axios.get(`${API}/dashboard/recent-submissions`);


// CRUD

export const getProblems = (params) =>
  axios.get(API, { params });

export const getProblem = (id) =>
  axios.get(`${API}/${id}`);

export const createProblem = (data) =>
  axios.post(API, data);

export const updateProblem = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteProblem = (id) =>
  axios.delete(`${API}/${id}`);

export const toggleStatus = (id) =>
  axios.patch(`${API}/${id}/status`);


// AI

export const generateProblem = (data) =>
  axios.post(`${API}/generate`, data);