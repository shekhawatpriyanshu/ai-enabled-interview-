import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAnalysis } from "../../services/ResumeService";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaBriefcase,
  FaRocket,
  FaSpinner,
  FaChartLine,
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";

const ResumeReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      const data = await getAnalysis(id);
      setAnalysis(data.analysis);
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
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-600 animate-spin"></div>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            Generating AI Resume Report...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!analysis) {
    return (
      <MainLayout showNavbar={false}>
        <div className="max-w-xl mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-xl">
          <FaFileAlt className="text-4xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-black text-slate-900">Report Not Found</h1>
          <p className="text-slate-500 text-xs font-semibold">
            We couldn't retrieve the analysis report. Please try analyzing your resume again.
          </p>
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:scale-105 transition-all"
          >
            Back to Resume Analyzer
          </button>
        </div>
      </MainLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Back Navigation & Top Actions */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between relative z-10"
        >
          <Link
            to="/resume-analyzer"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow-md font-extrabold text-xs transition-all duration-300"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200 text-indigo-600 text-xs" />
            <span>Analyze Another Resume</span>
          </Link>

          <Link
            to="/dashboard"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-extrabold text-xs transition-all"
          >
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 relative z-10"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-100/90 via-white to-cyan-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full shadow-2xs">
                  AI Detailed Report
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                  Resume Analysis Report
                </h1>
                <p className="text-slate-600 text-xs font-semibold mt-1">
                  Target Role Evaluation & Key Improvement Suggestions
                </p>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-3xl shadow-xs shrink-0">
                <FaChartLine />
              </div>
            </div>
          </motion.div>

          {/* Metric Cards Grid: ATS Score & Keyword Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ATS Score Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/50 rounded-3xl p-8 border border-cyan-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all duration-300 relative overflow-hidden"
            >
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-700 flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaChartLine className="text-xs" />
                </div>
                <span>ATS Compatibility Score</span>
              </h2>
              <p className="text-6xl sm:text-7xl font-black text-cyan-600 tracking-tight">
                {analysis.atsScore}%
              </p>
              <p className="text-slate-500 text-xs font-semibold mt-2">
                Overall match rate for the selected job description.
              </p>
            </motion.div>

            {/* Keyword Match Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/50 rounded-3xl p-8 border border-purple-200/90 shadow-sm hover:shadow-md hover:border-purple-400 transition-all duration-300 relative overflow-hidden"
            >
              <h2 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaCheckCircle className="text-xs" />
                </div>
                <span>Keyword Match</span>
              </h2>
              <p className="text-5xl sm:text-6xl font-black text-purple-600 tracking-tight">
                {analysis.keywordMatch?.matched}
                <span className="text-2xl sm:text-3xl text-slate-400 font-bold ml-2">
                  / {analysis.keywordMatch?.total}
                </span>
              </p>
              <p className="text-slate-500 text-xs font-semibold mt-2">
                Essential role keywords identified in your resume.
              </p>
            </motion.div>
          </div>

          {/* Matched Skills Chips */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500 text-base" />
              <span>Matched Skills</span>
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {analysis.skillsMatch?.map((skill, index) => (
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white border border-emerald-200 text-emerald-700 font-extrabold text-xs shadow-2xs hover:bg-emerald-50 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Missing Skills Chips */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FaTimesCircle className="text-rose-500 text-base" />
              <span>Missing Skills</span>
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {analysis.missingSkills?.map((skill, index) => (
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white border border-rose-200 text-rose-600 font-extrabold text-xs shadow-2xs hover:bg-rose-50 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Detailed Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <ReportCard title="Resume Summary" content={analysis.resumeSummary} icon={<FaFileAlt />} color="indigo" />
            <ReportCard title="Experience Analysis" content={analysis.experienceAnalysis} icon={<FaBriefcase />} color="cyan" />
            <ReportCard title="Projects Analysis" content={analysis.projectsAnalysis} icon={<FaRocket />} color="purple" />
            <ReportCard title="Suggestions & Guidance" content={analysis.suggestions?.join(", ")} icon={<FaLightbulb />} color="amber" />
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

const ReportCard = ({ title, content, icon, color = "indigo" }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2.5">
      <div className="p-2 rounded-xl bg-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        {icon}
      </div>
      <span>{title}</span>
    </h2>
    <p className="text-slate-700 leading-relaxed text-xs font-semibold">
      {content || "No details available."}
    </p>
  </motion.div>
);

export default ResumeReport;