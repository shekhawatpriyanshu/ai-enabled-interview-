import React from "react";

import StatsCard from "../../../admin/components/achievement/StatisticsCard";

const DashboardCards = ({ dashboard }) => {
  if (!dashboard) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      <StatsCard
        title="Total Achievements"
        value={dashboard.totalAchievements || 0}
      />

      <StatsCard
        title="Active Achievements"
        value={dashboard.activeAchievements || 0}
      />

      <StatsCard
        title="Inactive Achievements"
        value={dashboard.inactiveAchievements || 0}
      />

      <StatsCard
        title="Total Badges"
        value={dashboard.totalBadges || 0}
      />

      <StatsCard
        title="Total Rewards"
        value={dashboard.totalRewards || 0}
      />
    </div>
  );
};

export default DashboardCards;