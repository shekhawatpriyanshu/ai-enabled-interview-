import { motion } from "framer-motion";
import { useRef } from "react";

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
      transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="text-cyan-600">↑</span> Upload Your Resume
      </h2>

      {/* Custom File Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full mb-6 p-10 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all ${
          file ? "border-cyan-400 bg-cyan-50/50" : "border-slate-300 bg-white/50 hover:border-cyan-300 hover:bg-cyan-50/30"
        }`}
      >
        <span className="text-4xl mb-3">{file ? "📄" : "📁"}</span>
        <p className="text-slate-600 font-medium text-center">
          {file ? (
            <span className="text-cyan-700 font-bold">{file.name}</span>
          ) : (
            <>Drag and drop or <span className="text-cyan-600">click to browse</span></>
          )}
        </p>
        <p className="text-slate-400 text-sm mt-2">Supports .pdf, .doc, .docx (Max 5MB)</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-600 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">Target Role</label>
        <input
          type="text"
          placeholder="e.g. Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-sm"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAnalyze}
        disabled={loading || !file || !role}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white cursor-pointer py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            Analyzing Resume...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </motion.button>
    </motion.div>
  );
};

export default UploadResumeCard;