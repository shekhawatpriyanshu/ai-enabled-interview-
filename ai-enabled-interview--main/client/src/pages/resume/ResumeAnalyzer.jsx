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
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 via-fuchsia-500 to-amber-400" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-black uppercase tracking-wider shadow-xs">
                <FaRobot className="text-cyan-600 text-xs" />
                <span>AI-Powered Resume Analysis</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  AI Resume Analyzer
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Upload your resume to get instant ATS match scores, missing keyword analysis, and AI suggestions tailored to your target role.
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-3xl shadow-xs shrink-0">
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