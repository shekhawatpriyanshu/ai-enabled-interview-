import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnalysis } from "../../services/ResumeService";
import { motion } from "framer-motion";
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl drop-shadow-lg"
          >
            📄
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (!analysis) {
    return (
      <MainLayout showNavbar={false}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 flex items-center justify-center text-slate-800">
          <h1 className="text-3xl font-bold text-red-500">Report Not Found</h1>
        </div>
      </MainLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 p-6 md:p-12 overflow-hidden relative">
        
        {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900 drop-shadow-sm tracking-tight">
            Resume Report
          </h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white/70 hover:bg-white border border-white/50 rounded-full text-slate-700 font-bold shadow-sm transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-lg hover:border-cyan-300 hover:shadow-cyan-500/20 transition-all group">
            <h2 className="text-slate-500 text-sm uppercase tracking-widest font-bold mb-3 group-hover:text-cyan-600 transition-colors">
              ATS Score
            </h2>
            <p className="text-7xl font-black text-cyan-600 drop-shadow-sm">
              {analysis.atsScore}%
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-lg hover:border-purple-300 hover:shadow-purple-500/20 transition-all group">
            <h2 className="text-slate-500 text-sm uppercase tracking-widest font-bold mb-3 group-hover:text-purple-600 transition-colors">
              Keyword Match
            </h2>
            <p className="text-6xl font-black text-purple-600 drop-shadow-sm">
              {analysis.keywordMatch?.matched}
              <span className="text-3xl text-slate-400 font-bold ml-2">/ {analysis.keywordMatch?.total}</span>
            </p>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-xl text-slate-800 font-bold mb-5 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-sm border border-cyan-200">✓</span>
            Skills Match
          </h2>
          <div className="flex flex-wrap gap-3">
            {analysis.skillsMatch?.map((skill, index) => (
              <motion.span
                whileHover={{ scale: 1.05 }}
                key={index}
                className="px-5 py-2.5 rounded-full bg-white border border-cyan-200 text-cyan-700 font-semibold shadow-sm backdrop-blur-md cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-xl text-slate-800 font-bold mb-5 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-sm border border-red-200">✗</span>
            Missing Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {analysis.missingSkills?.map((skill, index) => (
              <motion.span
                whileHover={{ scale: 1.05 }}
                key={index}
                className="px-5 py-2.5 rounded-full bg-white border border-red-200 text-red-600 font-semibold shadow-sm backdrop-blur-md cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
          <Card title="Resume Summary" content={analysis.resumeSummary} icon="📝" />
          <Card title="Experience Analysis" content={analysis.experienceAnalysis} icon="💼" />
          <Card title="Projects Analysis" content={analysis.projectsAnalysis} icon="🚀" />
          <Card title="Suggestions" content={analysis.suggestions?.join(", ")} icon="💡" borderHover="border-yellow-400" />
        </motion.div>

      </motion.div>
    </div>
    </MainLayout>
  );
};

const Card = ({ title, content, icon, borderHover = "border-cyan-300" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-lg hover:${borderHover} hover:shadow-cyan-500/10 transition-all group`}
  >
    <h2 className="text-2xl text-slate-800 font-bold mb-4 flex items-center gap-3">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      {title}
    </h2>
    <p className="text-slate-600 leading-relaxed text-lg font-medium">
      {content}
    </p>
  </motion.div>
);

export default ResumeReport;