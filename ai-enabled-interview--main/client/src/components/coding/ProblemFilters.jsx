const ProblemFilters = ({
  difficulty,
  setDifficulty,
}) => {
  return (
    <div className="flex gap-4">
      <select
        value={difficulty}
        onChange={(e) =>
          setDifficulty(e.target.value)
        }
        className="border rounded-xl px-4 py-3 bg-white shadow-sm"
      >
        <option value="">
          All Difficulties
        </option>

        <option value="Easy">
          Easy
        </option>

        <option value="Medium">
          Medium
        </option>

        <option value="Hard">
          Hard
        </option>
      </select>
    </div>
  );
};

export default ProblemFilters;