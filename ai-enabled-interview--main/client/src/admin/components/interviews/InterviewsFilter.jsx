import { FaFilter, FaUndo } from "react-icons/fa";

const InterviewFilters = ({
  status,
  setStatus,
  experience,
  setExperience,
}) => {
  const clearFilters = () => {
    setStatus("");
    setExperience("");
  };

  return (
    <>
      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white shadow-sm"
      >
        <option value="">All Status</option>
        <option value="Started">Started</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Experience Filter */}
      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white shadow-sm"
      >
        <option value="">All Experience</option>
        <option value="Fresher">Fresher</option>
        <option value="Junior">Junior</option>
        <option value="Mid">Mid</option>
        <option value="Senior">Senior</option>
      </select>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition text-gray-700"
      >
        <FaUndo />
        Clear Filters
      </button>
    </>
  );
};

export default InterviewFilters;