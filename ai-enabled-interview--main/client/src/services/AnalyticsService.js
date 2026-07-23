// src/services/AnalyticsService.js

import axios from "axios";
import { getBackendUrl } from "../api/config";

const API = axios.create({
    baseURL: `${getBackendUrl()}/api/analytics`,
});

// Attach JWT Token Automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

// =========================
// Analytics
// =========================

// Create Analytics
export const createAnalytics = async () => {
    const { data } = await API.post("/create");
    return data;
};

// Get Logged In User Analytics
export const getMyAnalytics = async () => {
    const { data } = await API.get("/me");
    return data;
};

// Update Analytics
export const updateAnalytics = async (analyticsData) => {
    const { data } = await API.put("/update", analyticsData);
    return data;
};

// =========================
// Rewards
// =========================

// Get My Rewards
export const getMyRewards = async () => {
    const { data } = await API.get("/rewards");
    return data;
};

// =========================
// Admin APIs
// =========================

// Create Badge
export const createBadge = async (badgeData) => {
    const { data } = await API.post("/badge/create", badgeData);
    return data;
};

// Create Achievement
export const createAchievement = async (achievementData) => {
    const { data } = await API.post(
        "/achievement/create",
        achievementData
    );

    return data;
};

// Assign Reward
export const assignReward = async (rewardData) => {
    const { data } = await API.post(
        "/reward/assign",
        rewardData
    );

    return data;
};

// Get All Badges
export const getBadges = async () => {
  const { data } = await API.get("/badges");
  return data;
};

// Get All Achievements
export const getAchievements = async () => {
  const { data } = await API.get("/achievements");
  return data;
};

export default API;