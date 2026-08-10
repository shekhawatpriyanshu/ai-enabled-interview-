import { FaGraduationCap } from "react-icons/fa";

const EducationSection = ({ education, templateConfig, isLightMode }) => {
  if (!education || education.length === 0) return null;

  const accent = templateConfig?.accent || "from-amber-500 to-orange-500";

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        Education & Certifications
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {education.map((edu, index) => (
          <div
            key={index}
            className={`rounded-3xl p-6 shadow-md hover:shadow-lg transition space-y-2 border ${
              isLightMode ? "bg-white border-slate-200" : `${templateConfig?.cardBg || "bg-slate-900 border-slate-800"}`
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLightMode ? "text-slate-900" : "text-white"}`}>
                <FaGraduationCap className="text-amber-500 text-sm" />
                {edu.degree}
              </h3>
              {edu.year && (
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-gradient-to-r ${accent} text-white`}>
                  {edu.year}
                </span>
              )}
            </div>

            <p className={`text-xs font-bold ${isLightMode ? "text-slate-500" : "text-slate-400"}`}>
              {edu.institution}
            </p>

            {edu.description && (
              <p className={`text-xs font-medium leading-relaxed pt-1 ${isLightMode ? "text-slate-600" : "text-slate-300"}`}>
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;

