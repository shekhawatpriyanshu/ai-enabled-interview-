import { useEffect } from "react";

import useCommunity from "../../hooks/useCommunity";

import DiscussionCard from "./DiscussionCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

const DiscussionList = () => {
  const {
    discussions,
    loading,
    loadDiscussions,
  } = useCommunity();

  useEffect(() => {
    loadDiscussions();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && discussions.length === 0) {
    return (
      <EmptyState
        title="No Discussions Found"
        description="Start the first discussion with the community."
      />
    );
  }

  return (
    <div className="grid gap-6">

      {discussions.map((discussion) => (
        <DiscussionCard
          key={discussion._id}
          discussion={discussion}
        />
      ))}

    </div>
  );
};

export default DiscussionList;