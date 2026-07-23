import api from "./adminApi";


const RewardService = {

  // =====================================
  // GET REWARD DASHBOARD
  // =====================================

  getDashboard: async () => {

    const response =
      await api.get(
        "/rewards/dashboard"
      );

    return response.data;

  },



  // =====================================
  // GET ALL REWARDS
  // =====================================

  getRewards: async () => {

    const response =
      await api.get(
        "/rewards"
      );

    return response.data;

  },



  // =====================================
  // GET SINGLE REWARD
  // =====================================

  getRewardById: async (id) => {

    const response =
      await api.get(
        `/rewards/${id}`
      );

    return response.data;

  },



  // =====================================
  // GIVE MANUAL REWARD
  // =====================================

  giveReward: async (data) => {

    const response =
      await api.post(
        "/rewards/give",
        data
      );

    return response.data;

  },



  // =====================================
  // DELETE REWARD
  // =====================================

  deleteReward: async (id) => {

    const response =
      await api.delete(
        `/rewards/${id}`
      );

    return response.data;

  },


};


export default RewardService;