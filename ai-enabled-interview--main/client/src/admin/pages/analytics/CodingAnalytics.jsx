import { useEffect } from "react";

import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import CodingAnalyticsCard from "../../components/analytics/CodingAnalyticsCard";

const CodingAnalytics = () => {
  const {
    loading,
    codingAnalytics,
    getCoding,
  } = useAdminAnalytics();

  useEffect(() => {
    getCoding();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading Coding Analytics...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Coding Analytics
      </h1>

      <CodingAnalyticsCard
        analytics={codingAnalytics}
      />

    </div>
  );
};

export default CodingAnalytics;