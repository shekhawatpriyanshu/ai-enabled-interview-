import axios from "axios";
import { getBackendUrl } from "../api/config";

const API = axios.create({
  baseURL: `${getBackendUrl()}/api`,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ===========================
   DISCUSSIONS
=========================== */

export const getDiscussions = async () => {
  const { data } = await API.get("/community/discussion/all");
  return data;
};

export const createDiscussion = async (discussion) => {
  const { data } = await API.post(
    "/community/discussion/create",
    discussion
  );

  return data;
};

export const likeDiscussion = async (id) => {
  const { data } = await API.post(
    `/community/discussion/like/${id}`
  );

  return data;
};

/* ===========================
   COMMENTS
=========================== */

export const getComments = async (discussionId) => {
  const { data } = await API.get(
    `/community/comments/${discussionId}`
  );

  return data;
};

export const addComment = async (
  discussionId,
  text
) => {
  const { data } = await API.post(
    `/community/comment/${discussionId}`,
    { text }
  );

  return data;
};

/* ===========================
   STUDY GROUPS
=========================== */

export const getGroups = async () => {
  const { data } = await API.get(
    "/community/group/all"
  );

  return data;
};

export const createGroup = async (group) => {
  const { data } = await API.post(
    "/community/group/create",
    group
  );

  return data;
};

export const joinGroup = async (id) => {
  const { data } = await API.post(
    `/community/group/join/${id}`
  );

  return data;
};

/* ===========================
   GROUP CHAT
=========================== */

export const getMessages = async (groupId) => {
  const { data } = await API.get(
    `/community/group/messages/${groupId}`
  );

  return data;
};

export const sendMessage = async (groupId, payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await API.post(
    `/community/group/message/${groupId}`,
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined
  );

  return data;
};

export const editMessage = async (messageId, text) => {
  const { data } = await API.put(
    `/community/group/message/${messageId}`,
    { message: text }
  );
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await API.delete(
    `/community/group/message/${messageId}`
  );
  return data;
};

export default API;