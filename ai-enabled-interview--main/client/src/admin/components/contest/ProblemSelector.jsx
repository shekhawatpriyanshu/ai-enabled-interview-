import { useEffect, useMemo, useState } from "react";
import adminApi from "../../services/adminApi";

const ProblemSelector = ({
  selectedProblems = [],
  onChange,
}) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] =
    useState("All");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get(
        "/coding?limit=1000"
      );

      setProblems(res.data.problems || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty ===
          difficulty;

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [
    problems,
    search,
    difficulty,
  ]);

  const toggleProblem = (id) => {
    if (
      selectedProblems.includes(id)
    ) {
      onChange(
        selectedProblems.filter(
          (item) => item !== id
        )
      );
    } else {
      onChange([
        ...selectedProblems,
        id,
      ]);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold">
          Select Coding Problems
        </h3>

        <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          Selected :
          {" "}
          {selectedProblems.length}
        </span>

      </div>

      {/* Filters */}

      <div className="grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search problem..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value
            )
          }
          className="rounded-lg border p-3"
        >
          <option value="All">
            All Difficulty
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

      {/* List */}

      <div className="max-h-[450px] overflow-y-auto rounded-lg border">

        {loading && (
          <div className="p-6 text-center">
            Loading Problems...
          </div>
        )}

        {!loading &&
          filteredProblems.length ===
            0 && (
            <div className="p-6 text-center text-gray-500">
              No problems found.
            </div>
          )}

        {!loading &&
          filteredProblems.map(
            (problem) => (
              <label
                key={problem._id}
                className="flex cursor-pointer items-start gap-4 border-b p-4 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedProblems.includes(
                    problem._id
                  )}
                  onChange={() =>
                    toggleProblem(
                      problem._id
                    )
                  }
                  className="mt-1 h-5 w-5"
                />

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h4 className="font-semibold">
                      {problem.title}
                    </h4>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        problem.difficulty ===
                        "Easy"
                          ? "bg-green-100 text-green-700"
                          : problem.difficulty ===
                            "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {
                        problem.difficulty
                      }
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Topic :
                    {" "}
                    {problem.topic}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {problem.tags?.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-200 px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      )
                    )}

                  </div>

                  <div className="mt-3 flex gap-5 text-sm text-gray-500">

                    <span>
                      Time :
                      {" "}
                      {
                        problem.timeLimit
                      }
                      s
                    </span>

                    <span>
                      Memory :
                      {" "}
                      {
                        problem.memoryLimit
                      }
                      MB
                    </span>

                  </div>

                </div>
              </label>
            )
          )}

      </div>

    </div>
  );
};

export default ProblemSelector;