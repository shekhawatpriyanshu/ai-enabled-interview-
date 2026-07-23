import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useQuestion from "../../hooks/useQuestion";

import QuestionTable from "../../components/questionBank/QuestionTable";
import QuestionFilters from "../../components/questionBank/QuestionFilters";

const QuestionList = () => {
  const {
    questions,
    topics,
    companies,
    loading,
    fetchQuestions,
    fetchTopics,
    fetchCompanies,
  } = useQuestion();

  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    company: "",
    difficulty: "",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  const loadQuestions = async (currentFilters) => {
    const res = await fetchQuestions(currentFilters);
    if (res) {
      setTotalPages(res.totalPages || 1);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadQuestions(filters);
  }, [filters]);

  const loadInitialData = async () => {
    await Promise.all([
      fetchTopics(),
      fetchCompanies(),
    ]);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? value : 1, // Reset page to 1 on filter changes
    }));
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Question Bank
          </h1>

          <p className="text-gray-500 mt-1">
            Manage interview questions
          </p>
        </div>

        <Link
          to="/admin/questions/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          <FaPlus />

          Add Question
        </Link>

      </div>

      {/* Filters */}

      <QuestionFilters
        filters={filters}
        topics={topics}
        companies={companies}
        onChange={handleFilterChange}
      />

      {/* Table */}

      <div className="mt-6">

        <QuestionTable
          loading={loading}
          questions={questions}
        />

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white px-6 py-4 mt-4 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm text-slate-500 font-medium">
            Page <span className="text-slate-800 font-bold">{filters.page}</span> of{" "}
            <span className="text-slate-800 font-bold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => handleFilterChange("page", filters.page - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <FaChevronLeft size={14} className="text-slate-600" />
            </button>
            <button
              disabled={filters.page === totalPages}
              onClick={() => handleFilterChange("page", filters.page + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <FaChevronRight size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionList;