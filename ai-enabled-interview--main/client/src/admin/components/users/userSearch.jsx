import React, { useState, useEffect } from "react";

const UserSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // 🔍 Simple debounce (no extra library needed)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-full flex items-center gap-2 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {query && (
        <button
          onClick={() => setQuery("")}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default UserSearch;