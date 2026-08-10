const SkillsSection = ({ skills, templateConfig, isLightMode }) => {
  if (!skills || skills.length === 0) return null;

  const accent = templateConfig?.accent || "from-indigo-500 to-cyan-500";

  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        Technical Skills
      </h2>

      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-2xl font-extrabold text-xs tracking-wide shadow-xs border transition cursor-default ${
              isLightMode
                ? "bg-slate-100 text-slate-800 border-slate-200"
                : `${templateConfig?.cardBg || "bg-slate-900 border-slate-800"} text-slate-100`
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;

