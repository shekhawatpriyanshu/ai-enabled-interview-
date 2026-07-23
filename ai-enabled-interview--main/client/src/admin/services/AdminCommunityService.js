import api from "./adminApi";

const AdminCommunityService = {
    // ==========================
    // Dashboard & Analytics
    // ==========================
    getDashboard() {
        return api.get("/community/dashboard");
    },

    getAnalytics() {
        return api.get("/community/analytics");
    },

    // ==========================
    // Discussions
    // ==========================
    getDiscussions(params) {
        return api.get("/community/discussions", { params });
    },

    getDiscussionById(id) {
        return api.get(`/community/discussion/${id}`);
    },

    deleteDiscussion(id) {
        return api.delete(`/community/discussion/${id}`);
    },

    // ==========================
    // Comments
    // ==========================
    getComments(params) {
        return api.get("/community/comments", { params });
    },

    getDiscussionComments(id) {
        return api.get(`/community/comments/${id}`);
    },

    deleteComment(id) {
        return api.delete(`/community/comment/${id}`);
    },

    // ==========================
    // Groups
    // ==========================
    getGroups(params) {
        return api.get("/community/groups", { params });
    },

    getGroupById(id) {
        return api.get(`/community/group/${id}`);
    },

    updateGroup(id, data) {
        return api.put(`/community/group/${id}`, data);
    },

    deleteGroup(id) {
        return api.delete(`/community/group/${id}`);
    },

    // ==========================
    // Members
    // ==========================
    getGroupMembers(id) {
        return api.get(`/community/group/${id}/members`);
    },

    removeMember(groupId, userId) {
        return api.delete(`/community/group/${groupId}/member/${userId}`);
    },

    // ==========================
    // Messages
    // ==========================
    getMessages(params) {
        return api.get("/community/messages", { params });
    },

    getGroupMessages(id, params) {
        return api.get(`/community/group/${id}/messages`, { params });
    },

    deleteMessage(id) {
        return api.delete(`/community/message/${id}`);
    }
};

export default AdminCommunityService;