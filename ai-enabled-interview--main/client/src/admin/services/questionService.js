import adminApi from "./adminApi";

const questionService = {
  // ============================
  // Questions
  // ============================

  getQuestions(params) {
    return adminApi.get("/questions", { params });
  },

  getQuestion(id) {
    return adminApi.get(`/questions/${id}`);
  },

  createQuestion(data) {
    return adminApi.post("/questions", data);
  },

  updateQuestion(id, data) {
    return adminApi.put(`/questions/${id}`, data);
  },

  deleteQuestion(id) {
    return adminApi.delete(`/questions/${id}`);
  },

  // ============================
  // Topics
  // ============================

  getTopics() {
    return adminApi.get("/questions/topics");
  },

  getTopic(id) {
    return adminApi.get(`/questions/topics/${id}`);
  },

  createTopic(data) {
    return adminApi.post("/questions/topics", data);
  },

  updateTopic(id, data) {
    return adminApi.put(`/questions/topics/${id}`, data);
  },

  deleteTopic(id) {
    return adminApi.delete(`/questions/topics/${id}`);
  },

  // ============================
  // Companies
  // ============================

  getCompanies() {
    return adminApi.get("/questions/companies");
  },

  getCompany(id) {
    return adminApi.get(`/questions/companies/${id}`);
  },

  createCompany(data) {
    return adminApi.post("/questions/companies", data);
  },

  updateCompany(id, data) {
    return adminApi.put(`/questions/companies/${id}`, data);
  },

  deleteCompany(id) {
    return adminApi.delete(`/questions/companies/${id}`);
  },
};

export default questionService;