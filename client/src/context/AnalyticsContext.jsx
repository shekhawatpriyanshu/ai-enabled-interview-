// src/context/AnalyticsContext.jsx

import { createContext, useEffect, useState } from "react";
import {
  getMyAnalytics,
  getMyRewards,
} from "../services/AnalyticsService";

export const AnalyticsContext = createContext();

const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Fetch Analytics
  // ==========================
  const refreshAnalytics = async () => {
    try {
      setLoading(true);

      const res = await getMyAnalytics();

      if (res.success) {
        setAnalytics(res.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Fetch Rewards
  // ==========================
  const refreshRewards = async () => {
    try {
      setLoading(true);

      const res = await getMyRewards();

      if (res.success) {
        setRewards(res.rewards);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Data Initially
  // ==========================
  useEffect(() => {
    refreshAnalytics();
    refreshRewards();
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        rewards,
        loading,
        refreshAnalytics,
        refreshRewards,
        setAnalytics,
        setRewards,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;