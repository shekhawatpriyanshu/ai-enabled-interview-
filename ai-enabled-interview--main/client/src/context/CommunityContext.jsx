import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getBackendUrl } from "../api/config";

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
  editMessage,
  deleteMessage as deleteMessageApi,
} from "../services/CommunityService";

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  // -----------------------------
  // State
  // -----------------------------
  const [discussions, setDiscussions] = useState([]);
  const [comments, setComments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [socket, setSocket] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [activeMembers, setActiveMembers] = useState([]);
  // Initialize socket connection
  useEffect(() => {
    const socketUrl = getBackendUrl();
    const socketInstance = io(socketUrl);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Listen for real-time messages and active members
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (newMessage) => {
      setMessages((prev) => {
        // Safety check to ensure we only append messages for the currently viewed room
        if (newMessage.group !== activeGroupId) return prev;
        // Avoid duplicate messages (e.g. if HTTP response is handled before socket)
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    socket.on("active_members", (memberIds) => {
      console.log("Active members updated:", memberIds);
      setActiveMembers(memberIds || []);
    });

    socket.on("update_message", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    socket.on("delete_message", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("new_message");
      socket.off("active_members");
      socket.off("update_message");
      socket.off("delete_message");
    };
  }, [socket, activeGroupId]);

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

      setDiscussions((prev) =>
        prev.map((disc) => {
          if (disc._id === discussionId) {
            return {
              ...disc,
              comments: [res.comment, ...(disc.comments || [])],
            };
          }
          return disc;
        })
      );

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

      // Socket room joining/leaving
      if (socket) {
        if (activeGroupId && activeGroupId !== groupId) {
          socket.emit("leave_group", { groupId: activeGroupId, userId: user?._id });
        }
        socket.emit("join_group", { groupId, userId: user?._id });
        setActiveGroupId(groupId);
      }

      const res = await getMessages(groupId);

      setMessages(res.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (groupId, messageText, file) => {
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append("message", messageText || "");
        payload.append("file", file);
      } else {
        payload = { message: messageText };
      }

      const res = await sendMessage(groupId, payload);

      setMessages((prev) => {
        if (prev.some((m) => m._id === res.message._id)) return prev;
        return [...prev, res.message];
      });

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const updateMessage = async (messageId, text) => {
    try {
      const res = await editMessage(messageId, text);

      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? res.message : msg))
      );

      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const removeMessage = async (messageId) => {
    try {
      const res = await deleteMessageApi(messageId);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

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
    activeMembers,

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
    updateMessage,
    removeMessage,
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