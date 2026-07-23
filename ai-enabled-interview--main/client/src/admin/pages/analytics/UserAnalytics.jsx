import { useEffect } from "react";

import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import UserAnalyticsCard from "../../components/analytics/UserAnalyticsCard";

const UserAnalytics = () => {
  const {
    loading,
    userAnalytics,
    getUsers,
  } = useAdminAnalytics();

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        User Analytics
      </h1>

      <UserAnalyticsCard
        analytics={userAnalytics}
      />

    </div>
  );
};

export default UserAnalytics;