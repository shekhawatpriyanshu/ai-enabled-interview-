import API from "../api/axios";

export const generateProblem = async (
  data
) => {
  const res = await API.post(
    "/coding/generate",
    data
  );

  return res.data;
};
// ===============================
// Get All Coding Problems
// ===============================
export const getProblems = async (params) => {
  const res = await API.get(
    "/coding",
    { params }
  );

  return res.data;
};

// ===============================
// Get Single Problem
// ===============================
export const getProblem = async (id) => {
  const res = await API.get(
    `/coding/${id}`
  );

  return res.data;
};

// ===============================
// Create Problem (Admin)
// ===============================
export const createProblem = async (
  problemData
) => {
  const res = await API.post(
    "/coding/problem/create",
    problemData
  );

  return res.data;
};

// ===============================
// Update Problem (Admin)
// ===============================
export const updateProblem = async (
  id,
  problemData
) => {
  const res = await API.put(
    `/coding/problem/${id}`,
    problemData
  );

  return res.data;
};

// ===============================
// Delete Problem (Admin)
// ===============================
export const deleteProblem = async (
  id
) => {
  const res = await API.delete(
    `/coding/problem/${id}`
  );

  return res.data;
};

// ===============================
// Submit Code
// ===============================
export const submitCode = async (
  id,
  submission
) => {
  const res = await API.post(
    `/coding/submit/${id}`,
    submission
  );

  return res.data;
};

// ===============================
// Get Logged-in User Submissions
// ===============================
export const getMySubmissions =
  async () => {
    const res = await API.get(
      "/coding/submissions/my"
    );

    return res.data;
  };
 

export const runCode = async (payload) => {
  const res = await API.post("/coding/run", payload);
  return res.data;
};