const FilterBar = ({
  filters,
  setFilters,
  topics = [],
  companies = [],
}) => {
  // Handle change
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset filters
  const clearFilters = () => {
    setFilters({
      difficulty: "",
      topic: "",
      company: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-wrap gap-4 items-center">

      {/* Difficulty */}
      <select
        value={filters.difficulty}
        onChange={(e) =>
          handleChange("difficulty", e.target.value)
        }
        className="border px-3 py-2 rounded-xl text-sm"
      >
        <option value="">All Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Topic */}
      <select
        value={filters.topic}
        onChange={(e) =>
          handleChange("topic", e.target.value)
        }
        className="border px-3 py-2 rounded-xl text-sm"
      >
        <option value="">All Topics</option>
        {topics.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Company */}
      <select
        value={filters.company}
        onChange={(e) =>
          handleChange("company", e.target.value)
        }
        className="border px-3 py-2 rounded-xl text-sm"
      >
        <option value="">All Companies</option>
        {companies.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm transition"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterBar;