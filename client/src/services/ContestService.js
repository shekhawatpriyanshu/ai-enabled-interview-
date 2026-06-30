import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/contests",
});

// Attach JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================
// Contest APIs
// ==============================

// Get All Contests
export const getContests = async () => {
  const { data } = await API.get("/");

  return data;
};

// Get Single Contest
export const getContest = async (id) => {
  const { data } = await API.get(`/${id}`);

  return data;
};

// Create Contest (Admin)
export const createContest = async (contestData) => {
  const { data } = await API.post(
    "/create",
    contestData
  );

  return data;
};

// Join Contest
export const joinContest = async (contestId) => {
  const { data } = await API.post(
    `/join/${contestId}`
  );

  return data;
};

// Submit Contest
export const submitContest = async (
  contestId,
  submission
) => {
  const { data } = await API.post(
    `/submit/${contestId}`,
    submission
  );

  return data;
};

// Leaderboard
export const getLeaderboard = async (
  contestId
) => {
  const { data } = await API.get(
    `/leaderboard/${contestId}`
  );

  return data;
};

// My Contests
export const getMyContests = async () => {
  const { data } = await API.get(
    "/my/contests"
  );

  return data;
};