import API from "../api/axios";

export const createLiveInterviewRoom = async (roomData) => {
  const response = await API.post("/live-interviews/create", roomData);
  return response.data;
};

export const getLiveInterviewRooms = async (email) => {
  const url = email ? `/live-interviews?email=${encodeURIComponent(email)}` : "/live-interviews";
  const response = await API.get(url);
  return response.data;
};

export const getLiveInterviewRoomById = async (roomId) => {
  const response = await API.get(`/live-interviews/${roomId}`);
  return response.data;
};

export const runCodeInRoom = async (roomId, codeData) => {
  const response = await API.post(`/live-interviews/${roomId}/run`, codeData);
  return response.data;
};

export const submitAndEndInterview = async (roomId, submitData) => {
  const response = await API.post(`/live-interviews/${roomId}/submit`, submitData);
  return response.data;
};

export const endLiveInterviewRoom = async (roomId) => {
  const response = await API.post(`/live-interviews/${roomId}/submit`, {});
  return response.data;
};

export const cancelLiveInterviewRoom = async (roomId, reason) => {
  const response = await API.post(`/live-interviews/${roomId}/cancel`, { reason });
  return response.data;
};

export const deleteLiveInterviewRoom = async (roomId) => {
  const response = await API.delete(`/live-interviews/${roomId}`);
  return response.data;
};

export const getAllUsers = async () => {
  try {
    const response = await API.get("/live-interviews/users/all");
    return response.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return { success: false, users: [] };
  }
};
