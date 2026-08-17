import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFileAlt, FaRobot } from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import UploadResumeCard from "../../components/resume/UploadResumeCard";
import { uploadResume, analyzeResume } from "../../services/ResumeService";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    try {
      if (!file) {
        alert("Please select a resume file.");
        return;
      }
      if (!role) {
        alert("Please enter target job role.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const uploaded = await uploadResume(formData);
      const resumeId = uploaded.resume._id;

      await analyzeResume(resumeId, role);
      navigate(`/resume-report/${resumeId}`);
    } catch (error) {
      console.error("Resume Error:", error);
      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:border-cyan-300 transition-all duration-500 relative overflow-hidden z-10 group"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 via-fuchsia-500 to-amber-400" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <FaRobot className="text-cyan-600 text-sm animate-pulse" />
                <span>AI-Powered Resume & Portfolio Studio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                AI Resume & <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">Portfolio Hub</span>
              </h1>

              <p className="text-slate-600 text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
                Upload your resume to get instant ATS compatibility scores, keyword match analysis, and 1-click AI developer portfolio website creation!
              </p>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/25 shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-cyan-300/30">
              <FaFileAlt />
            </div>
          </div>
        </motion.div>

        {/* Upload Resume Card */}
        <div className="relative z-10">
          <UploadResumeCard
            file={file}
            setFile={setFile}
            role={role}
            setRole={setRole}
            loading={loading}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeAnalyzer;