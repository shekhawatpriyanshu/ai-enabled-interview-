import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";

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
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Contest Details...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!contest) {
    return (
      <MainLayout showNavbar={false}>
        <div className="max-w-xl mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-xl">
          <AlertCircle className="text-4xl text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Contest Not Found</h2>
          <p className="text-slate-500 text-xs font-semibold">The contest you are looking for does not exist or has been removed.</p>
          <Link
            to="/contests"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:scale-105 transition-all"
          >
            Back to Contests
          </Link>
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
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Colorful Ambient Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Back Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between relative z-10"
        >
          <Link
            to="/contests"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow-md font-extrabold text-xs transition-all duration-300"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200 text-indigo-600" />
            <span>Back to All Contests</span>
          </Link>
        </motion.div>

        {/* Contest Header */}
        <div className="relative z-10">
          <ContestHeader contest={contest} />
        </div>

        {/* Live / Countdown Timer */}
        <div className="relative z-10">
          <ContestTimer contest={contest} />
        </div>

        {/* Stats */}
        <div className="relative z-10">
          <ContestStats contest={contest} />
        </div>

        {/* Join Contest Section */}
        <div className="relative z-10">
          <JoinContestCard
            contest={contest}
            isJoined={isJoined}
            isLive={isLive}
            isUpcoming={isUpcoming}
            isEnded={isEnded}
            onJoinSuccess={handleJoinSuccess}
          />
        </div>

        {/* Problems Section */}
        <div id="contest-problems-section" ref={problemsSectionRef} className="relative z-10">
          {isJoined && isLive ? (
            <ProblemList problems={contest.problems} />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3">
              <h3 className="text-xl font-black text-slate-900 tracking-tight text-center w-full">
                Coding Problems Section
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-lg mx-auto text-center leading-relaxed w-full">
                {isUpcoming
                  ? "This contest has not started yet. Problems will be available once the contest goes live and you join."
                  : isEnded
                  ? "This contest has ended."
                  : "You must join this live contest to view and solve the coding challenges."}
              </p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="relative z-10">
          <LeaderboardTable leaderboard={leaderboard} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ContestDetails;