import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          Search
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;