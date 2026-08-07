import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCode, FaHistory, FaExclamationCircle } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import SubmissionTable from "../../components/coding/SubmissionTable";
import { getMySubmissions } from "../../services/CodingService";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getMySubmissions();
      setSubmissions(res.submissions || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Ambient Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-600 via-pink-500 to-amber-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <FaHistory className="text-purple-600 text-xs" />
                <span>Coding Submissions Log</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Coding Problem Submissions
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Review your submitted solutions, test case evaluation scores, and problem completion history.
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-2xl shadow-xs shrink-0">
              <FaCode />
            </div>
          </div>
        </motion.div>

        {/* Content Body */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
              Loading Submissions...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-3xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <FaCode className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                No Coding Submissions Found
              </h2>
              <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">
                Solve coding problems to start building your submission history and track your score progress.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-slate-600">
                Total Submissions Recorded
              </span>
              <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full shadow-2xs">
                {submissions.length} Submissions
              </span>
            </div>

            <SubmissionTable submissions={submissions} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SubmissionHistory;