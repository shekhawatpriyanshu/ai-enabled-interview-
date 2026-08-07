import { motion } from "framer-motion";
import { useRef } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaBullseye,
  FaRocket,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const UploadResumeCard = ({ file, setFile, role, setRole, onAnalyze, loading }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-slate-800"
    >
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-sm" />
          <span>Upload Resume & Target Role</span>
        </h2>
        <span className="text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full shadow-2xs">
          Step 1 of 2
        </span>
      </div>

      {/* Custom File Upload Drag & Drop Zone */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full mb-6 p-8 sm:p-12 rounded-3xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group ${
          file
            ? "border-cyan-500 bg-gradient-to-br from-cyan-50/90 via-white to-indigo-50/60 shadow-md ring-4 ring-cyan-500/10"
            : "border-slate-300 bg-slate-50/80 hover:border-cyan-400 hover:bg-white hover:shadow-lg"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md ${
            file
              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/25"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {file ? <FaFilePdf /> : <FaCloudUploadAlt />}
        </div>

        <p className="text-slate-800 font-extrabold text-base text-center">
          {file ? (
            <span className="text-cyan-700 font-black flex items-center justify-center gap-2">
              <FaCheckCircle className="text-emerald-500 text-sm" />
              {file.name}
            </span>
          ) : (
            <>
              Drag & drop your resume or{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent underline font-black">
                browse file
              </span>
            </>
          )}
        </p>
        
        <p className="text-slate-400 text-xs font-semibold mt-1.5">
          Supports .PDF, .DOC, .DOCX (Max file size 5MB)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {/* Target Role Field */}
      <div className="mb-8 space-y-2 group">
        <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <FaBullseye className="text-xs" />
          </div>
          <span>Target Job Role</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Frontend Developer, Fullstack Engineer, Data Scientist"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200 font-semibold text-sm placeholder-slate-400 shadow-2xs hover:shadow-xs"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAnalyze}
        disabled={loading || !file || !role}
        className="w-full bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white cursor-pointer py-4 rounded-2xl font-black text-sm tracking-wider shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin text-base" />
            <span>Analyzing Resume with AI...</span>
          </>
        ) : (
          <>
            <FaRocket className="text-sm" />
            <span>Analyze Resume Now</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default UploadResumeCard;