import { useEffect } from "react";

import useCommunity from "../../hooks/useCommunity";

import GroupCard from "./GroupCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const GroupList = () => {
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

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
        />
      ))}
    </div>
  );
};

export default GroupList;