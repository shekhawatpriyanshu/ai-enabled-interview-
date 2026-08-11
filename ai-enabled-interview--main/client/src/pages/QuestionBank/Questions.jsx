import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getQuestions,
  getTopics,
  getCompanies,
} from "../../services/QuestionService";

import MainLayout from "../../layouts/MainLayout";
import QuestionHeader from "../../components/QuestionBank/QuestionHeader";
import SearchBar from "../../components/QuestionBank/SearchBar";
import FilterBar from "../../components/QuestionBank/FilterBar";
import QuestionTable from "../../components/QuestionBank/QuestionTable";

const Questions = () => {
  const [searchParams] = useSearchParams();

  // ==========================================
  // State
  // ==========================================

  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    difficulty: "",
    topic: searchParams.get("topic") || "",
    company: searchParams.get("company") || "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const QUESTIONS_PER_PAGE = 10;

  // ==========================================
  // Fetch Topics & Companies
  // ==========================================

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [topicsRes, companiesRes] = await Promise.all([
          getTopics(),
          getCompanies(),
        ]);

        setTopics(topicsRes.topics || []);
        setCompanies(companiesRes.companies || []);
      } catch (error) {
        console.error(
          "Error fetching question bank metadata:",
          error
        );
      }
    };

    fetchMetadata();
  }, []);

  // ==========================================
  // Fetch Questions
  // ==========================================

  const fetchQuestionsList = async () => {
    try {
      setLoading(true);

      const res = await getQuestions({
        search: searchQuery,
        difficulty: filters.difficulty,
        topic: filters.topic,
        company: filters.company,
        page: currentPage,
        limit: QUESTIONS_PER_PAGE,
      });

      setQuestions(res.questions || []);

      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error(
        "Error fetching questions:",
        error
      );

      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch when search/filter/page changes
  // ==========================================

  useEffect(() => {
    fetchQuestionsList();
  }, [
    searchQuery,
    filters.difficulty,
    filters.topic,
    filters.company,
    currentPage,
  ]);

  // ==========================================
  // Reset page when search/filter changes
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filters.difficulty,
    filters.topic,
    filters.company,
  ]);

  // ==========================================
  // Update filters from URL
  // ==========================================

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,

      topic:
        searchParams.get("topic") || "",

      company:
        searchParams.get("company") || "",
    }));
  }, [searchParams]);

  // ==========================================
  // Render
  // ==========================================

  return (
    <MainLayout>

      <div
        className="
          min-h-screen
          bg-slate-50
          text-slate-800
          p-4
          sm:p-6
          lg:p-8
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            space-y-6
            animate-[fadeIn_0.4s_ease-out]
          "
        >

          {/* ======================================
              QUESTION HEADER
          ====================================== */}

          <QuestionHeader
            title="Question Bank"
            subtitle="Practice interview questions by topic, company, and difficulty."
            showButton={false}
          />

          {/* ======================================
              SEARCH + FILTERS
          ====================================== */}

          <div
            className="
              w-full
              flex
              flex-col
              lg:flex-row
              items-center
              gap-3
            "
          >

            {/* ====================================
                SEARCH BOX
            ==================================== */}

            <div
              className="
                w-full
                lg:w-[300px]
                lg:flex-shrink-0
              "
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* ====================================
                FILTERS
            ==================================== */}

            <div
              className="
                w-full
                flex-1
                min-w-0
              "
            >

              <FilterBar
                filters={filters}
                setFilters={setFilters}
                topics={topics}
                companies={companies}
              />

            </div>

          </div>

          {/* ======================================
              QUESTION TABLE
          ====================================== */}

          <QuestionTable
            questions={questions}
            loading={loading}
          />

          {/* ======================================
              PAGINATION
          ====================================== */}

          {!loading && totalPages > 1 && (

            <div
              className="
                bg-white/90
                border
                border-slate-200/90
                rounded-3xl
                p-4
                flex
                flex-wrap
                justify-between
                items-center
                gap-4
                mt-6
                shadow-sm
              "
            >

              {/* ==================================
                  PREVIOUS BUTTON
              ================================== */}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className="
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-white
                  border
                  border-slate-200
                  hover:bg-slate-50
                  text-slate-700
                  text-sm
                  font-bold
                  transition-all
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                  shadow-sm
                  flex
                  items-center
                  gap-2
                "
              >
                ← Previous
              </button>

              {/* ==================================
                  PAGE NUMBER
              ================================== */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >

                <span>
                  Page
                </span>

                <span
                  className="
                    px-3.5
                    py-1
                    rounded-xl
                    bg-indigo-50
                    border
                    border-indigo-100
                    text-indigo-700
                    font-extrabold
                  "
                >
                  {currentPage}
                </span>

                <span>
                  of{" "}

                  <strong
                    className="
                      text-slate-800
                      font-bold
                    "
                  >
                    {totalPages}
                  </strong>

                </span>

              </div>

              {/* ==================================
                  NEXT BUTTON
              ================================== */}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-white
                  border
                  border-slate-200
                  hover:bg-slate-50
                  text-slate-700
                  text-sm
                  font-bold
                  transition-all
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  cursor-pointer
                  shadow-sm
                  flex
                  items-center
                  gap-2
                "
              >
                Next →
              </button>

            </div>
          )}

        </div>

      </div>

    </MainLayout>
  );
};

export default Questions;