import { createContext, useContext, useEffect, useState } from "react";

import {
  getDiscussions,
  createDiscussion,
  likeDiscussion,
  getComments,
  addComment,
  getGroups,
  createGroup,
  joinGroup,
  getMessages,
  sendMessage,
} from "../services/CommunityService";

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  // -----------------------------
  // State
  // -----------------------------
  const [discussions, setDiscussions] = useState([]);
  const [comments, setComments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Discussion APIs
  // -----------------------------

  const loadDiscussions = async () => {
    try {
      setLoading(true);

      const res = await getDiscussions();

      setDiscussions(res.discussions || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewDiscussion = async (discussion) => {
    try {
      setLoading(true);

      const res = await createDiscussion(discussion);

      setDiscussions((prev) => [
        res.discussion,
        ...prev,
      ]);

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeDiscussion = async (id) => {
    try {
      await likeDiscussion(id);

      await loadDiscussions();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // -----------------------------
  // Comments
  // -----------------------------

  const loadComments = async (discussionId) => {
    try {
      setLoading(true);

      const res = await getComments(discussionId);

      setComments(res.comments || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (discussionId, text) => {
    try {
      const res = await addComment(discussionId, text);

      setComments((prev) => [
        res.comment,
        ...prev,
      ]);

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // -----------------------------
  // Study Groups
  // -----------------------------

  const loadGroups = async () => {
    try {
      setLoading(true);

      const res = await getGroups();

      setGroups(res.groups || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async (group) => {
    try {
      const res = await createGroup(group);

      setGroups((prev) => [
        res.group,
        ...prev,
      ]);

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const joinStudyGroup = async (groupId) => {
    try {
      await joinGroup(groupId);

      await loadGroups();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // -----------------------------
  // Group Chat
  // -----------------------------

  const loadMessages = async (groupId) => {
    try {
      setLoading(true);

      const res = await getMessages(groupId);

      setMessages(res.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (groupId, message) => {
    try {
      const res = await sendMessage(groupId, message);

      setMessages((prev) => [
        ...prev,
        res.message,
      ]);

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // -----------------------------
  // Initial Load
  // -----------------------------

  useEffect(() => {
    loadDiscussions();
    loadGroups();
  }, []);

  // -----------------------------
  // Context Value
  // -----------------------------

  const value = {
    loading,
    error,

    discussions,
    comments,
    groups,
    messages,

    loadDiscussions,
    createNewDiscussion,
    toggleLikeDiscussion,

    loadComments,
    createComment,

    loadGroups,
    createNewGroup,
    joinStudyGroup,

    loadMessages,
    createMessage,
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () =>
  useContext(CommunityContext);

export default CommunityContext;