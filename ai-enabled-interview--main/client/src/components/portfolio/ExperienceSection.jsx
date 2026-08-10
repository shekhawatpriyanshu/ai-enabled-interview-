import { FaBriefcase } from "react-icons/fa";

const ExperienceSection = ({ experience, templateConfig, isLightMode }) => {
  if (!experience || experience.length === 0) return null;

  const accent = templateConfig?.accent || "from-emerald-500 to-teal-500";

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        Work Experience
      </h2>

      <div className="relative border-l-2 border-slate-700/40 ml-4 pl-6 space-y-8">
        {experience.map((exp, index) => (
          <div key={index} className="relative group">
            <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-r ${accent} ring-4 ring-slate-950 shadow-md group-hover:scale-125 transition`} />

            <div className={`rounded-3xl p-6 shadow-md hover:shadow-lg transition space-y-2 border ${
              isLightMode ? "bg-white border-slate-200" : `${templateConfig?.cardBg || "bg-slate-900 border-slate-800"}`
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className={`text-base font-black flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
                  <FaBriefcase className="text-xs opacity-70" />
                  {exp.role}
                </h3>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full w-fit bg-gradient-to-r ${accent} text-white shadow-xs`}>
                  {exp.duration}
                </span>
              </div>

              <p className={`text-xs font-bold ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
                {exp.company}
              </p>

              <p className={`text-xs font-medium leading-relaxed pt-1 ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;

