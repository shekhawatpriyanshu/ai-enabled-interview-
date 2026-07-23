import api from "./adminApi";

const BASE_URL = "/contests";

const ContestService = {
  // ==============================
  // Get All Contests
  // ==============================
  getContests: async () => {
    const { data } = await api.get(BASE_URL);
    return data;
  },

  // ==============================
  // Get Contest By ID
  // ==============================
  getContest: async (id) => {
    const { data } = await api.get(
      `${BASE_URL}/${id}`
    );
    return data;
  },

  // ==============================
  // Create Contest
  // ==============================
  createContest: async (contestData) => {
    const { data } = await api.post(
      BASE_URL,
      contestData
    );
    return data;
  },

  // ==============================
  // Update Contest
  // ==============================
  updateContest: async (
    id,
    contestData
  ) => {
    const { data } = await api.put(
      `${BASE_URL}/${id}`,
      contestData
    );
    return data;
  },

  // ==============================
  // Delete Contest
  // ==============================
  deleteContest: async (id) => {
    const { data } = await api.delete(
      `${BASE_URL}/${id}`
    );
    return data;
  },

  // ==============================
  // Contest Participants
  // ==============================
  getParticipants: async (id) => {
    const { data } = await api.get(
      `${BASE_URL}/${id}/participants`
    );
    return data;
  },

  // ==============================
  // Contest Leaderboard
  // ==============================
  getLeaderboard: async (id) => {
    const { data } = await api.get(
      `${BASE_URL}/${id}/leaderboard`
    );
    return data;
  },
};

export default ContestService;