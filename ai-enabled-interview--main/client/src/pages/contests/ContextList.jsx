import { useEffect } from "react";

import useContest from "../../hooks/useContest";

import ContestCard from "../../components/contests/ContestCard";
import LoadingSkeleton from "../../components/contests/LoadingSkeleton";
import EmptyState from "../../components/contests/EmptyState";

const ContestList = () => {
  const {
    contests,
    loading,
    loadContests,
  } = useContest();

  useEffect(() => {
    loadContests();
  }, [loadContests]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && contests.length === 0) {
    return (
      <EmptyState
        title="No Contests Available"
        description="There are currently no coding contests. Please check back later."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {contests.map((contest) => (
        <ContestCard
          key={contest._id}
          contest={contest}
        />
      ))}

    </div>
  );
};

export default ContestList;