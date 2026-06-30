import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import { getTests } from "../../services/TestService";

import TestCard from "../../components/tests/TestCard";
import LoadingSkeleton from "../../components/tests/LoadingSkeleton";
import EmptyState from "../../components/tests/EmptyState";

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);

      const res = await getTests();

      setTests(res.tests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load tests."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchSearch =
        test.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        test.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchDifficulty =
        difficulty === "All"
          ? true
          : test.difficulty === difficulty;

      return matchSearch && matchDifficulty;
    });
  }, [tests, search, difficulty]);

  const stats = {
    total: tests.length,
    easy: tests.filter((t) => t.difficulty === "Easy").length,
    medium: tests.filter((t) => t.difficulty === "Medium").length,
    hard: tests.filter((t) => t.difficulty === "Hard").length,
  };

  return (
    <MainLayout showNavbar>

      <div className="space-y-8">

        {/* Header */}

        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl text-white p-8">

          <h1 className="text-4xl font-bold">
            Mock Tests
          </h1>

          <p className="mt-3 text-cyan-100 text-lg">
            Practice full interview assessments and
            improve your placement preparation.
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Total Tests
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-green-50 rounded-2xl shadow p-6">
            <p className="text-green-700">
              Easy
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-2">
              {stats.easy}
            </h2>
          </div>

          <div className="bg-yellow-50 rounded-2xl shadow p-6">
            <p className="text-yellow-700">
              Medium
            </p>

            <h2 className="text-3xl font-bold text-yellow-700 mt-2">
              {stats.medium}
            </h2>
          </div>

          <div className="bg-red-50 rounded-2xl shadow p-6">
            <p className="text-red-700">
              Hard
            </p>

            <h2 className="text-3xl font-bold text-red-700 mt-2">
              {stats.hard}
            </h2>
          </div>

        </div>

        {/* Search + Filter */}

        <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search mock tests..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

        </div>

        {/* Tests */}

        {loading ? (
          <LoadingSkeleton />
        ) : filteredTests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredTests.map((test) => (
              <TestCard
                key={test._id}
                test={test}
              />
            ))}

          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default TestsPage;