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

  // Fetch topics and companies on mount
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
        console.error("Error fetching question bank metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch questions on search query, filter, or page change
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
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsList();
  }, [searchQuery, filters, currentPage]);

  // Reset page to 1 if search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Update filters if URL parameters change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      topic: searchParams.get("topic") || "",
      company: searchParams.get("company") || "",
    }));
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.4s_ease-out]">
          <QuestionHeader
            title="Question Bank"
            subtitle="Practice interview questions by topic, company, and difficulty."
            showButton={false}
          />

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            topics={topics}
            companies={companies}
          />

          <QuestionTable questions={questions} loading={loading} />

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-4 flex flex-wrap justify-between items-center gap-4 mt-6 shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <span>Page</span>
                <span className="px-3.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold">
                  {currentPage}
                </span>
                <span>of <strong className="text-slate-800 font-bold">{totalPages}</strong></span>
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
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