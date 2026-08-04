import { useState } from "react";

const InterviewForm = ({
  onSubmit,
  loading,
}) => {
  const [role, setRole] =
    useState("Java");

  const [
    experienceLevel,
    setExperienceLevel,
  ] = useState("Fresher");

  const submitHandler = (
    e
  ) => {
    e.preventDefault();

    onSubmit({
      role,
      experienceLevel,
    });
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div className="text-left">
        <label className="block mb-2 text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Target Role
        </label>

        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-800/60 text-white border border-slate-600 rounded-xl p-4 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option className="bg-slate-800 text-white">Java</option>
            <option className="bg-slate-800 text-white">React</option>
            <option className="bg-slate-800 text-white">Node.js</option>
            <option className="bg-slate-800 text-white">Sql</option>
            <option className="bg-slate-800 text-white">Spring Boot</option>
            <option className="bg-slate-800 text-white">Aws</option>
            <option className="bg-slate-800 text-white">PHP</option>
            <option className="bg-slate-800 text-white">Python</option>
            <option className="bg-slate-800 text-white">C</option>
            <option className="bg-slate-800 text-white">C++</option>
            <option className="bg-slate-800 text-white">Salesforce</option>
            <option className="bg-slate-800 text-white">QA Engineer</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="text-left">
        <label className="block mb-2 text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Experience Level
        </label>

        <div className="relative">
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-slate-800/60 text-white border border-slate-600 rounded-xl p-4 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option className="bg-slate-800 text-white">Fresher</option>
            <option className="bg-slate-800 text-white">Junior</option>
            <option className="bg-slate-800 text-white">Mid</option>
            <option className="bg-slate-800 text-white">Senior</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Questions...
          </>
        ) : (
          "🚀 Start Interview"
        )}
      </button>
    </form>
  );
};

export default InterviewForm;