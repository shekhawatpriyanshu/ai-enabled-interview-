const SearchBar = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search coding problems..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
      />
    </div>
  );
};

export default SearchBar;