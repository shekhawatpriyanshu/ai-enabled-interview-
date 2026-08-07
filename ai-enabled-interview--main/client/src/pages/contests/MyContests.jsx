import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Swords, CalendarCheck, ArrowRight, UserCircle, Star, Award } from "lucide-react";

import useContest from "../../hooks/useContest";
import MainLayout from "../../layouts/MainLayout";

const MyContests = () => {
  const { myContests, loading, loadMyContests } = useContest();

  useEffect(() => {
    loadMyContests();
  }, [loadMyContests]);

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading your contest history...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Floating Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-600 via-pink-500 to-amber-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <UserCircle size={14} className="text-purple-600" />
                <span>My Contest Performance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  My Contest History
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Track your contest participation history, score accumulation, solved problems breakdown, and leaderboard rank.
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-3xl shadow-xs shrink-0">
              <Trophy size={32} />
            </div>
          </div>
        </motion.div>

        {/* Content Body */}
        {myContests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4 max-w-2xl mx-auto relative z-10"
          >
            <div className="w-20 h-20 rounded-3xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <Swords size={36} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                No Joined Contests Yet
              </h2>
              <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
                You haven't participated in any coding contests yet. Join upcoming live challenges to climb the leaderboard!
              </p>
            </div>

            <Link
              to="/contests"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
            >
              <Swords size={16} />
              <span>Browse Active Contests</span>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4 relative z-10">
            {myContests.map((item, index) => {
              const contest = item.contest || {};
              return (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3, scale: 1.005 }}
                  className="group bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 rounded-3xl p-6 border border-indigo-200/90 shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {contest.title || "Coding Contest"}
                      </h2>
                      <p className="text-slate-600 text-xs font-semibold mt-1">
                        {contest.description || "Live algorithmic competition session."}
                      </p>
                    </div>

                    <Link
                      to={`/contests/${contest._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm hover:scale-105 transition-all shrink-0 uppercase tracking-wider"
                    >
                      <span>View Session Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 p-4 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">Total Score</span>
                      <span className="text-2xl font-black text-blue-700 mt-0.5 block">{item.score || 0}</span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 p-4 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">Problems Solved</span>
                      <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{item.solvedProblems || 0}</span>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 p-4 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">Total Challenges</span>
                      <span className="text-2xl font-black text-amber-700 mt-0.5 block">{item.totalProblems || 0}</span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border border-purple-200/80 p-4 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">Leaderboard Rank</span>
                      <span className="text-2xl font-black text-purple-700 mt-0.5 block">#{item.rank || 1}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyContests;