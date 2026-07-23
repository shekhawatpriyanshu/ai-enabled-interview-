import api from "./adminApi";

const AdminAnalyticsService = {
  getDashboard: async () => {
    const res = await api.get("/analytics/dashboard");
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get("/analytics/users");
    return res.data;
  },

  getInterviews: async () => {
    const res = await api.get("/analytics/interviews");
    return res.data;
  },

  getCoding: async () => {
    const res = await api.get("/analytics/coding");
    return res.data;
  },

  getResume: async () => {
    const res = await api.get("/analytics/resume");
    return res.data;
  },
};

export default AdminAnalyticsService;