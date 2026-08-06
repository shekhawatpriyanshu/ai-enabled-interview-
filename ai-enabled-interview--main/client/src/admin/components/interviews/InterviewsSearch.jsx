import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const InterviewSearch = ({ value = "", onChange }) => {
  const [search, setSearch] = useState(value);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onChange]);

  return (
    <div className="relative w-full flex items-center md:col-span-2">
      <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
        <FaSearch className="w-4 h-4" />
      </div>

      <input
        type="text"
        placeholder="Type candidate name, email, or target role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm"
      />
    </div>
  );
};

export default InterviewSearch;