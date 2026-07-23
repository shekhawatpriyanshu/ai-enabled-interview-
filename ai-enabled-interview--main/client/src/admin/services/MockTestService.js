import api from "./adminApi";

const MockTestService = {
  // Get all mock tests
  getMockTests: async (params = {}) => {
    const response = await api.get("/tests", {
      params,
    });

    return response.data;
  },

  // Get single mock test
  getMockTestById: async (id) => {
    const response = await api.get(`/tests/${id}`);

    return response.data;
  },

  // Create mock test
  createMockTest: async (data) => {
    const response = await api.post("/tests", data);

    return response.data;
  },

  // Update mock test
  updateMockTest: async (id, data) => {
    const response = await api.put(
      `/tests/${id}`,
      data
    );

    return response.data;
  },

  // Delete mock test
  deleteMockTest: async (id) => {
    const response = await api.delete(
      `/tests/${id}`
    );

    return response.data;
  },

  // Get all questions for Question Selector
  getQuestions: async () => {
    const response = await api.get(
      "/questions?limit=1000"
    );

    return response.data;
  },
};

export default MockTestService;