import { useEffect } from "react";
import { Trophy, Swords, CalendarCheck, ArrowRight, UserCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useContest from "../../hooks/useContest";
import MainLayout from "../../layouts/MainLayout";
import ContestCard from "../../components/contests/ContestCard";
import LoadingSkeleton from "../../components/contests/LoadingSkeleton";
import EmptyState from "../../components/contests/EmptyState";

const ContestList = () => {
  const { contests, loading, loadContests } = useContest();

  useEffect(() => {
    loadContests();
  }, [loadContests]);

  const activeContestsCount = contests?.filter(c => c.status === 'Upcoming' || c.status === 'Live').length || 0;

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Colorful Ambient Background Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-600 via-fuchsia-500 to-cyan-400" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles size={14} className="text-purple-600 animate-pulse" />
                <span>Live Coding Contests</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  Coding Contests
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Compete with developers in real time, solve algorithmic challenges, build speed, and climb global leaderboards.
              </p>
            </div>

            <Link
              to="/contests/my"
              className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 shrink-0 uppercase tracking-wider"
            >
              <UserCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span>My Contests History</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 relative z-10">
            <div className="group bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 rounded-2xl p-4 flex items-center gap-3 border border-indigo-200/80 shadow-2xs hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Swords size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-slate-900 leading-none block">{contests?.length || 0}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mt-0.5 truncate">Total Contests</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 rounded-2xl p-4 flex items-center gap-3 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <CalendarCheck size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-slate-900 leading-none block">{activeContestsCount}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mt-0.5 truncate">Active & Live</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 rounded-2xl p-4 flex items-center gap-3 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Trophy size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-slate-900 leading-none block">Global</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mt-0.5 truncate">Leaderboard</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/40 rounded-2xl p-4 flex items-center gap-3 border border-cyan-200/80 shadow-2xs hover:shadow-md transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-lg shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-slate-900 leading-none block">Automated</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mt-0.5 truncate">AI Judge</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contests List Grid */}
        <div className="relative z-10">
          {loading ? (
            <LoadingSkeleton />
          ) : contests.length === 0 ? (
            <EmptyState
              title="No Contests Available"
              description="There are currently no active coding contests. Check back soon for upcoming tournaments!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {contests.map((contest, index) => (
                <ContestCard key={contest._id} contest={contest} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ContestList;