import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search questions...",
}) => {
  return (
    <div className="relative w-full">

      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;