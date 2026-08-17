import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaSpinner,
  FaRobot,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaSearch,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getMyInterviews } from "../../services/InterviewService";
import InterviewCard from "../../components/interview/InterviewCard";

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInterviews, setTotalInterviews] = useState(0);

  useEffect(() => {
    loadInterviews(currentPage);
  }, [currentPage]);

  const loadInterviews = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getMyInterviews(page, 9);
      setInterviews(data.interviews || []);
      setTotalPages(data.totalPages || 1);
      setTotalInterviews(data.totalInterviews || 0);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Floating Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all duration-500 relative overflow-hidden z-10 group"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-400" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <FaRobot className="text-indigo-600 text-sm animate-pulse" />
                <span>AI Interview History & Submissions Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                My Interview <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Submissions</span>
              </h1>

              <p className="text-slate-600 text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
                Track your AI mock interview sessions, view real-time coding evaluation scores, and review detailed per-question feedback.
              </p>
            </div>

            <Link
              to="/interviews/start"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 shrink-0 border border-indigo-400/20"
            >
              <FaRocket className="text-sm group-hover:rotate-12 transition-transform duration-300 text-amber-300" />
              <span>Start New Interview</span>
            </Link>
          </div>
        </motion.div>

        {/* Content Body */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
              Loading Interview Sessions...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-2 max-w-2xl mx-auto">
            <FaExclamationCircle className="text-3xl text-rose-600 mx-auto" />
            <h3 className="text-lg font-bold text-rose-900">{error}</h3>
            <button
              onClick={() => loadInterviews(currentPage)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <FaRobot className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                No Interview Sessions Found
              </h2>
              <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
                You haven't completed any AI interview sessions yet. Start your first mock interview session now!
              </p>
            </div>

            <Link
              to="/interviews/start"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <FaRocket />
              <span>Start First Interview</span>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <p className="text-xs font-extrabold text-slate-600">
                Showing Page <span className="text-indigo-600 font-black">{currentPage}</span> of{" "}
                <span className="text-indigo-600 font-black">{totalPages}</span>
              </p>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Total Submissions: {totalInterviews}
              </span>
            </div>

            {/* Grid of Interview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  <FaChevronLeft className="text-[10px]" />
                  <span>Previous</span>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all duration-200 ${
                      currentPage === index + 1
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <FaChevronRight className="text-[10px]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyInterviews;