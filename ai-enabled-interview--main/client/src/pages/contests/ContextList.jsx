import { useEffect } from "react";
import { Trophy, Swords, CalendarCheck, ArrowRight, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Hero Header */}
          <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl border border-white p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <Trophy size={40} className="animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-900 mb-4 tracking-tight">
                    Coding Contests
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl font-medium">
                    Compete with others, test your algorithms, and climb the leaderboard. Join live challenges or practice with past ones.
                  </p>
                </div>
              </div>
              <Link
                to="/contests/my"
                className="group flex items-center gap-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-indigo-500/30 hover:-translate-y-1 shrink-0"
              >
                <UserCircle size={20} className="group-hover:scale-110 transition-transform" />
                My Contests
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10 pt-8 border-t border-indigo-100/50">
              <div className="group bg-white/50 hover:bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-white hover:border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
                <div className="w-14 h-14 flex items-center justify-center bg-indigo-50 rounded-full mb-3 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                  <Swords className="text-indigo-500" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-800 leading-none mb-1">{contests?.length || 0}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</span>
              </div>
              <div className="group bg-white/50 hover:bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-white hover:border-green-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
                <div className="w-14 h-14 flex items-center justify-center bg-green-50 rounded-full mb-3 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300">
                  <CalendarCheck className="text-green-500" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-800 leading-none mb-1">
                  {contests?.filter(c => c.status === 'Upcoming' || c.status === 'Live').length || 0}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="relative z-10">
            {loading ? (
              <LoadingSkeleton />
            ) : contests.length === 0 ? (
              <EmptyState
                title="No Contests Available"
                description="There are currently no coding contests. Please check back later."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default ContestList;