import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
        alert("Please select a resume");
        return;
      }
      if (!role) {
        alert("Please enter target role");
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
      console.log("Resume Error:", error);
      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 p-4 md:p-10 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="text-center mb-10 mt-12 md:mt-4">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-cyan-500/20 border-4 border-white"
          >
            📄
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900 tracking-tight">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-600 font-medium mt-3 text-lg">
            Upload your resume and get instant AI-powered feedback tailored to your target role.
          </p>
        </div>

        <UploadResumeCard
          file={file}
          setFile={setFile}
          role={role}
          setRole={setRole}
          loading={loading}
          onAnalyze={handleAnalyze}
        />
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzer;