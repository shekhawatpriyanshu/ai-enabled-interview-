import API from "../api/axios";

// ==============================
// Get All Tests
// ==============================
export const getTests = async () => {
  const res = await API.get("/test");
  return res.data;
};

// ==============================
// Get Single Test
// ==============================
export const getTest = async (id) => {
  const res = await API.get(`/test/${id}`);
  return res.data;
};

// ==============================
// Create Test (Admin)
// ==============================
export const createTest = async (data) => {
  const res = await API.post("/test/create", data);
  return res.data;
};

// ==============================
// Update Test (Admin)
// ==============================
export const updateTest = async (id, data) => {
  const res = await API.put(`/test/update/${id}`, data);
  return res.data;
};

// ==============================
// Delete Test (Admin)
// ==============================
export const deleteTest = async (id) => {
  const res = await API.delete(`/test/delete/${id}`);
  return res.data;
};

// ==============================
// Submit Test
// ==============================
export const submitTest = async (payload) => {
  const res = await API.post("/test/submit", payload);
  return res.data;
};

// ==============================
// My Submissions
// ==============================
export const getMySubmissions = async () => {
  const res = await API.get("/test/my-submissions");
  return res.data;
};