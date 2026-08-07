import { useState } from "react";
import toast from "react-hot-toast";
import AdminAnalyticsService from "../services/AdminAnalyticsService";

// Global in-memory cache for instantaneous page switching
let analyticsCache = {
  dashboard: null,
  userAnalytics: null,
  interviewAnalytics: null,
  codingAnalytics: null,
  resumeAnalytics: null,
  timestamp: 0,
};

const CACHE_TTL = 60 * 1000; // 1 minute fresh cache window

const useAdminAnalytics = () => {
  const [loading, setLoading] = useState(!analyticsCache.dashboard);

  const [dashboard, setDashboard] = useState(analyticsCache.dashboard);
  const [userAnalytics, setUserAnalytics] = useState(analyticsCache.userAnalytics);
  const [interviewAnalytics, setInterviewAnalytics] = useState(analyticsCache.interviewAnalytics);
  const [codingAnalytics, setCodingAnalytics] = useState(analyticsCache.codingAnalytics);
  const [resumeAnalytics, setResumeAnalytics] = useState(analyticsCache.resumeAnalytics);

  const loadAllAnalytics = async (forceRefresh = false) => {
    const isCacheValid =
      !forceRefresh &&
      analyticsCache.dashboard &&
      Date.now() - analyticsCache.timestamp < CACHE_TTL;

    if (isCacheValid) {
      setDashboard(analyticsCache.dashboard);
      setUserAnalytics(analyticsCache.userAnalytics);
      setInterviewAnalytics(analyticsCache.interviewAnalytics);
      setCodingAnalytics(analyticsCache.codingAnalytics);
      setResumeAnalytics(analyticsCache.resumeAnalytics);
      setLoading(false);
      return;
    }

    if (!analyticsCache.dashboard) {
      setLoading(true);
    }

    try {
      const [dashRes, userRes, intRes, codeRes, resRes] = await Promise.allSettled([
        AdminAnalyticsService.getDashboard(),
        AdminAnalyticsService.getUsers(),
        AdminAnalyticsService.getInterviews(),
        AdminAnalyticsService.getCoding(),
        AdminAnalyticsService.getResume(),
      ]);

      const newDashboard = dashRes.status === "fulfilled" ? dashRes.value?.dashboard : analyticsCache.dashboard;
      const newUserAnalytics = userRes.status === "fulfilled" ? userRes.value?.analytics : analyticsCache.userAnalytics;
      const newInterviewAnalytics = intRes.status === "fulfilled" ? intRes.value?.analytics : analyticsCache.interviewAnalytics;
      const newCodingAnalytics = codeRes.status === "fulfilled" ? codeRes.value?.analytics : analyticsCache.codingAnalytics;
      const newResumeAnalytics = resRes.status === "fulfilled" ? resRes.value?.analytics : analyticsCache.resumeAnalytics;

      if (newDashboard) setDashboard(newDashboard);
      if (newUserAnalytics) setUserAnalytics(newUserAnalytics);
      if (newInterviewAnalytics) setInterviewAnalytics(newInterviewAnalytics);
      if (newCodingAnalytics) setCodingAnalytics(newCodingAnalytics);
      if (newResumeAnalytics) setResumeAnalytics(newResumeAnalytics);

      analyticsCache = {
        dashboard: newDashboard || analyticsCache.dashboard,
        userAnalytics: newUserAnalytics || analyticsCache.userAnalytics,
        interviewAnalytics: newInterviewAnalytics || analyticsCache.interviewAnalytics,
        codingAnalytics: newCodingAnalytics || analyticsCache.codingAnalytics,
        resumeAnalytics: newResumeAnalytics || analyticsCache.resumeAnalytics,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const getDashboard = () => loadAllAnalytics();
  const getUsers = () => loadAllAnalytics();
  const getInterviews = () => loadAllAnalytics();
  const getCoding = () => loadAllAnalytics();
  const getResume = () => loadAllAnalytics();

  return {
    loading,
    dashboard,
    userAnalytics,
    interviewAnalytics,
    codingAnalytics,
    resumeAnalytics,
    loadAllAnalytics,
    getDashboard,
    getUsers,
    getInterviews,
    getCoding,
    getResume,
  };
};

export default useAdminAnalytics;