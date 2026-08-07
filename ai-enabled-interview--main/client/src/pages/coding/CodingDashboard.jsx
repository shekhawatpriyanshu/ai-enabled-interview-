import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaCheckCircle, FaLaptopCode, FaChartBar, FaBrain } from "react-icons/fa";
import { getCodingStats } from "../../services/SubmissionService";
import CodingStats from "../../components/coding/CodingStats";
import MainLayout from "../../layouts/MainLayout";

const CodingDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getCodingStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Coding Profile...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!stats) return null;

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Floating Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <FaBrain className="text-indigo-600 text-xs" />
                <span>Coding Skill Analytics</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                  Coding Profile Dashboard
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Track your coding problem completion breakdown, language proficiency, and submission statistics.
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-3xl shadow-xs shrink-0">
              <FaLaptopCode />
            </div>
          </div>
        </motion.div>

        {/* Coding Stats Component */}
        <div className="relative z-10">
          <CodingStats stats={stats} />
        </div>

        {/* Language Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative z-10 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FaChartBar className="text-purple-600" />
              <span>Language Submission Breakdown</span>
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Active Programming Languages
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.languages || {}).length > 0 ? (
              Object.entries(stats.languages).map(([lang, count]) => (
                <motion.div
                  key={lang}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/60 hover:to-white transition-all duration-300 flex flex-col items-center text-center shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <FaCode />
                  </div>
                  <span className="font-black text-slate-900 text-sm capitalize group-hover:text-indigo-600 transition-colors">
                    {lang}
                  </span>
                  <span className="text-xs font-bold text-slate-500 mt-1">
                    {count} Submissions
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400 font-semibold text-xs italic">
                No language submission data recorded yet. Solve coding problems to build your profile stats!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default CodingDashboard;
