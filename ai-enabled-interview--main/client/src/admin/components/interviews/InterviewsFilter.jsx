import { FaFilter, FaStar } from "react-icons/fa";

const InterviewFilters = ({
  status,
  setStatus,
  experience,
  setExperience,
}) => {
  return (
    <>
      {/* Status Filter */}
      <div className="relative flex items-center col-span-1">
        <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
          <FaFilter className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full pl-9 pr-7 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
        >
          <option value="" className="bg-white font-normal text-slate-800 py-1">
            All Status
          </option>
          <option value="Started" className="bg-white font-normal text-slate-800 py-1">
            In Progress
          </option>
          <option value="Completed" className="bg-white font-normal text-slate-800 py-1">
            Completed
          </option>
        </select>
      </div>

      {/* Experience Filter */}
      <div className="relative flex items-center col-span-1">
        <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
          <FaStar className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full pl-9 pr-7 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
        >
          <option value="" className="bg-white font-normal text-slate-800 py-1">
            All Experience
          </option>
          <option value="Fresher" className="bg-white font-normal text-slate-800 py-1">
            Fresher
          </option>
          <option value="Junior" className="bg-white font-normal text-slate-800 py-1">
            Junior
          </option>
          <option value="Mid" className="bg-white font-normal text-slate-800 py-1">
            Mid Level
          </option>
          <option value="Senior" className="bg-white font-normal text-slate-800 py-1">
            Senior
          </option>
        </select>
      </div>
    </>
  );
};

export default InterviewFilters;