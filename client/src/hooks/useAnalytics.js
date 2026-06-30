// src/hooks/useAnalytics.js

import { useContext } from "react";
import { AnalyticsContext } from "../context/AnalyticsContext";

const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error(
      "useAnalytics must be used within an AnalyticsProvider"
    );
  }

  return context;
};

export default useAnalytics;