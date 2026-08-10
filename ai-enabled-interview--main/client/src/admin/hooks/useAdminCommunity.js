import { useState } from "react";

import toast from "react-hot-toast";

import AdminCommunityService from "../services/AdminCommunityService";



const useAdminCommunity = () => {


  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);





  const handleRequest = async (
    apiCall
  ) => {

    try {


      setLoading(true);


      const response =
        await apiCall();


      setData(
        response.data
      );


      return response.data;


    }
    catch (error) {


      toast.error(

        error.response?.data?.message ||
        "Something went wrong"

      );


    }
    finally {

      setLoading(false);

    }


  };





  // Dashboard

  const getDashboard = () => {

    return handleRequest(
      () => AdminCommunityService.getDashboard()
    );

  };

  const getAnalytics = () => {

    return handleRequest(
      () => AdminCommunityService.getAnalytics()
    );

  };




  // Discussions

  const getDiscussions = (params) => {

    return handleRequest(
      () => AdminCommunityService.getDiscussions(params)
    );

  };



  const getDiscussionById = (id) => {
    return handleRequest(
      () => AdminCommunityService.getDiscussionById(id)
    );
  };

  const updateDiscussion = (id, data) => {
    return handleRequest(
      () => AdminCommunityService.updateDiscussion(id, data)
    );
  };

  const deleteDiscussion = (id) => {
    return handleRequest(
      () => AdminCommunityService.deleteDiscussion(id)
    );
  };






  // Comments

  const getComments = (params) => {
    return handleRequest(
      () => AdminCommunityService.getComments(params)
    );
  };

  const getCommentById = (id) => {
    return handleRequest(
      () => AdminCommunityService.getCommentById(id)
    );
  };

  const updateComment = (id, data) => {
    return handleRequest(
      () => AdminCommunityService.updateComment(id, data)
    );
  };

  const deleteComment = (id) => {
    return handleRequest(
      () => AdminCommunityService.deleteComment(id)
    );
  };







  // Groups

  const getGroups = (params) => {

    return handleRequest(
      () => AdminCommunityService.getGroups(params)
    );

  };



  const deleteGroup = (id) => {

    return handleRequest(
      () => AdminCommunityService.deleteGroup(id)
    );

  };




  const updateGroup = (id, data) => {

    return handleRequest(
      () => AdminCommunityService.updateGroup(id, data)
    );

  };

  const getGroupById = (id) => {
    return handleRequest(() => AdminCommunityService.getGroupById(id));
  };

  const getGroupMembers = (id) => {
    return handleRequest(() => AdminCommunityService.getGroupMembers(id));
  };

  const removeMember = (groupId, userId) => {
    return handleRequest(() => AdminCommunityService.removeMember(groupId, userId));
  };





  // Messages

  const getMessages = (params) => {
    return handleRequest(
      () => AdminCommunityService.getMessages(params)
    );
  };

  const getMessageById = (id) => {
    return handleRequest(
      () => AdminCommunityService.getMessageById(id)
    );
  };

  const updateMessage = (id, data) => {
    return handleRequest(
      () => AdminCommunityService.updateMessage(id, data)
    );
  };

  const deleteMessage = (id) => {
    return handleRequest(
      () => AdminCommunityService.deleteMessage(id)
    );
  };

  return {
    loading,
    data,
    getDashboard,
    getAnalytics,
    getDiscussions,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion,

    getComments,
    getCommentById,
    updateComment,
    deleteComment,

    getGroups,
    getGroupById,
    deleteGroup,
    updateGroup,
    getGroupMembers,
    removeMember,
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage
  };
};

export default useAdminCommunity;