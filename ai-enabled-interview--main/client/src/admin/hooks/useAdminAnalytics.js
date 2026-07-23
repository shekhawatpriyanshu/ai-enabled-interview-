import { useState } from "react";
import toast from "react-hot-toast";

import AdminAnalyticsService from "../services/AdminAnalyticsService";

const useAdminAnalytics = () => {
  const [loading, setLoading] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [interviewAnalytics, setInterviewAnalytics] = useState(null);
  const [codingAnalytics, setCodingAnalytics] = useState(null);
  const [resumeAnalytics, setResumeAnalytics] = useState(null);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const data =
        await AdminAnalyticsService.getDashboard();

      setDashboard(data.dashboard);

      return data.dashboard;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminAnalyticsService.getUsers();
      setUserAnalytics(data.analytics);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load user analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const getInterviews = async () => {
    try {
      setLoading(true);
      const data = await AdminAnalyticsService.getInterviews();
      setInterviewAnalytics(data.analytics);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load interview analytics"
      );
    } finally {
      setLoading(false);
    }
  };

const getCoding = async () => {
  try {
    setLoading(true);

    const data =
      await AdminAnalyticsService.getCoding();

    setCodingAnalytics(
      data.analytics
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to load coding analytics"
    );
  } finally {
    setLoading(false);
  }
};
const getResume = async () => {

  try {

    setLoading(true);

    const data =
      await AdminAnalyticsService.getResume();

    setResumeAnalytics(
      data.analytics
    );

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to load resume analytics"
    );

  } finally {

    setLoading(false);

  }

};
  return {
    loading,

    dashboard,
    userAnalytics,
    interviewAnalytics,
    codingAnalytics,
    resumeAnalytics,

    getDashboard,
    getUsers,
    getInterviews,
    getCoding,
    getResume
  };
};

export default useAdminAnalytics;