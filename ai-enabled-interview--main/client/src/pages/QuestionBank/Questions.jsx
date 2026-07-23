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
      <div className="space-y-6">
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
          <div className="flex justify-center items-center gap-2 mt-6 pb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            
            <span className="text-slate-600 text-sm font-medium mx-2">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Questions;