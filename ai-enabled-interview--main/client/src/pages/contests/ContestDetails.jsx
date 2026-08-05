import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import useContest from "../../hooks/useContest";

import MainLayout from "../../layouts/MainLayout";
import ContestHeader from "../../components/contests/ContestHeader";
import ContestStats from "../../components/contests/ContestStats";
import ContestTimer from "../../components/contests/ContestTimer";
import JoinContestCard from "../../components/contests/JoinContestCard";
import ProblemList from "../../components/contests/ProblemList";
import LeaderboardTable from "../../components/contests/LeaderboardTable";

const ContestDetails = () => {
  const { id } = useParams();
  const problemsSectionRef = useRef(null);

  const {
    contest,
    leaderboard,
    loadContest,
    loadLeaderboard,
    loading,
    myContests,
    loadMyContests,
  } = useContest();

  useEffect(() => {
    if (id) {
      loadContest(id);
      loadLeaderboard(id);
      loadMyContests();
    }
  }, [id, loadContest, loadLeaderboard, loadMyContests]);

  if (loading && !contest) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!contest) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Contest Not Found</h2>
            <p className="text-gray-500">The contest you are looking for does not exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  
  const isLive = contest.status === "Live" || (now >= start && now < end);
  const isUpcoming = contest.status !== "Live" && (contest.status === "Upcoming" || now < start);
  const isEnded = contest.status !== "Live" && (contest.status === "Completed" || now > end);

  const isJoined = myContests.some(
    (item) => (item.contest?._id || item.contest) === contest._id
  );

  const handleJoinSuccess = async () => {
    await loadMyContests();
    setTimeout(() => {
      const el = document.getElementById("contest-problems-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 py-8 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 relative z-10">

      {/* Contest Header */}
      <ContestHeader contest={contest} />

      {/* Live / Countdown Timer */}
      <ContestTimer contest={contest} />

      {/* Stats */}
      <ContestStats contest={contest} />

      {/* Join Contest Section */}
      <JoinContestCard
        contest={contest}
        isJoined={isJoined}
        isLive={isLive}
        isUpcoming={isUpcoming}
        isEnded={isEnded}
        onJoinSuccess={handleJoinSuccess}
      />

      {/* Problems Section */}
      <div id="contest-problems-section" ref={problemsSectionRef}>
        {isJoined && isLive ? (
          <ProblemList problems={contest.problems} />
        ) : (
          <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-500">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Coding Problems</h3>
            <p className="text-sm">
              {isUpcoming
                ? "This contest has not started yet. Problems will be available once the contest is live and you have joined."
                : isEnded
                ? "This contest has ended."
                : "You must join this live contest to view and solve the coding problems."}
            </p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <LeaderboardTable leaderboard={leaderboard} />

        </div>
      </div>
    </MainLayout>
  );
};

export default ContestDetails;