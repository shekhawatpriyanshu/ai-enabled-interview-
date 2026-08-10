import { useState } from "react";

const rolesList = [
  { id: "Java", label: "Java", icon: "☕" },
  { id: "React", label: "React", icon: "⚛️" },
  { id: "Node.js", label: "Node.js", icon: "🟢" },
  { id: "Python", label: "Python", icon: "🐍" },
  { id: "Sql", label: "SQL", icon: "🗄️" },
  { id: "Spring Boot", label: "Spring Boot", icon: "🍃" },
  { id: "Aws", label: "AWS Cloud", icon: "☁️" },
  { id: "C++", label: "C++", icon: "⚙️" },
  { id: "QA Engineer", label: "QA / Testing", icon: "🧪" },
  { id: "Salesforce", label: "Salesforce", icon: "☁️" },
  { id: "PHP", label: "PHP", icon: "🐘" },
  { id: "C", label: "C", icon: "💻" },
];

const experienceLevels = [
  { id: "Fresher", label: "Fresher", subtitle: "0 - 1 Years", icon: "🎓", badge: "Entry" },
  { id: "Junior", label: "Junior", subtitle: "1 - 3 Years", icon: "🌱", badge: "Beginner" },
  { id: "Mid", label: "Mid-Level", subtitle: "3 - 5 Years", icon: "🚀", badge: "Intermediate" },
  { id: "Senior", label: "Senior", subtitle: "5+ Years", icon: "👑", badge: "Expert" },
];

const InterviewForm = ({ onSubmit, loading }) => {
  const [role, setRole] = useState("Java");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");

  const selectedRoleValue = isCustomRole ? customRoleInput : role;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedRoleValue.trim()) return;
    onSubmit({
      role: selectedRoleValue,
      experienceLevel,
    });
  };

  return (
    <form onSubmit={submitHandler} className="space-y-8">
      {/* Target Role Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <span>🎯</span> Select Target Role
          </label>
          <button
            type="button"
            onClick={() => setIsCustomRole(!isCustomRole)}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors underline decoration-dashed underline-offset-4 cursor-pointer"
          >
            {isCustomRole ? "← Choose from presets" : "+ Custom role"}
          </button>
        </div>

        {!isCustomRole ? (
          <div>
            {/* Preset Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-200">
              {rolesList.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`group relative p-3 rounded-2xl border text-left transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-500 shadow-md shadow-indigo-500/10 scale-[1.02]"
                        : "bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                        {r.icon}
                      </span>
                      <span
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-indigo-700 font-extrabold" : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {r.label}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dropdown fallback */}
            <div className="mt-3 relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white text-slate-800 text-sm border border-slate-200 rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer hover:border-slate-300 font-semibold"
              >
                {rolesList.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white text-slate-800">
                    {r.icon} {r.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              placeholder="e.g. Flutter Developer, Machine Learning Engineer..."
              className="w-full bg-white text-slate-800 text-base font-semibold border border-indigo-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Experience Level Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-purple-600 uppercase tracking-widest flex items-center gap-2">
          <span>🧠</span> Select Experience Level
        </label>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {experienceLevels.map((lvl) => {
            const isSelected = experienceLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setExperienceLevel(lvl.id)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 transform active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-500 shadow-md shadow-purple-500/10 scale-[1.02]"
                    : "bg-slate-50/70 border-slate-200 hover:border-purple-300 hover:bg-white hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                    {lvl.icon}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-slate-200/80 text-slate-600 border-slate-300"
                    }`}
                  >
                    {lvl.badge}
                  </span>
                </div>
                <h4
                  className={`text-sm font-extrabold ${
                    isSelected ? "text-purple-800" : "text-slate-800 group-hover:text-purple-600"
                  }`}
                >
                  {lvl.label}
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{lvl.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !selectedRoleValue.trim()}
          className="relative w-full overflow-hidden group rounded-2xl p-[2px] font-bold text-lg cursor-pointer transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          {/* Animated gradient border line */}
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 rounded-2xl"></span>

          {/* Button content */}
          <div className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-[14px] transition-all duration-300 group-hover:bg-opacity-90 flex items-center justify-center gap-3 text-white">
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-extrabold tracking-wide text-white">
                  Preparing AI Environment...
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🚀</span>
                <span className="text-white font-extrabold text-xl tracking-wide">
                  Start Mock Interview Now
                </span>
                <svg
                  className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;