import { useEffect } from "react";

import useCommunity from "../../hooks/useCommunity";

import GroupCard from "./GroupCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const GroupList = ({ limit }) => {
  const {
    groups,
    loading,
    loadGroups,
  } = useCommunity();

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && groups.length === 0) {
    return (
      <EmptyState
        title="No Study Groups Found"
        description="Create the first study group and start learning together."
      />
    );
  }

  const displayedGroups = limit ? groups.slice(0, limit) : groups;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {displayedGroups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
        />
      ))}
    </div>
  );
};

export default GroupList;