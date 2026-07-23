import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const InterviewSearch = ({ value = "", onChange }) => {
  const [search, setSearch] = useState(value);

  // Keep local state in sync if parent changes it
  useEffect(() => {
    setSearch(value);
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onChange]);

  const clearSearch = () => {
    setSearch("");
    onChange("");
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Search Icon */}
      <div className="absolute left-4 text-gray-400 flex items-center justify-center pointer-events-none">
        <FaSearch className="w-4 h-4" />
      </div>

      <input
        type="text"
        placeholder="Search by candidate, email or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white shadow-sm"
      />

    </div>
  );
};

export default InterviewSearch;