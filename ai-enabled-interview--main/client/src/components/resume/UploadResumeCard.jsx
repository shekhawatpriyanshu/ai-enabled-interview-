const UploadResumeCard = ({
  file,
  setFile,
  role,
  setRole,
  onAnalyze,
  loading,
}) => {
  return (
    <div
      className="
      bg-white/5
      border
      border-white/10
      backdrop-blur-xl
      rounded-3xl
      p-8
      shadow-xl
    "
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Upload Resume
      </h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
        className="w-full mb-5 text-white cursor-pointer"
      />

      <input
        type="text"
        placeholder="Target Role "
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value
          )
        }
        className="
        w-full
        p-4
        rounded-xl
        bg-slate-900
        border
        border-slate-700
        text-white
        mb-5
      "
      />

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="
        w-full
        bg-gradient-to-r
        from-cyan-500
        to-purple-600
        text-white cursor-pointer
        py-4
        rounded-xl
        font-semibold
      "
      >
        {loading
          ? "Analyzing..."
          : "Analyze Resume"}
      </button>
    </div>
  );
};

export default UploadResumeCard;