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

  // Fetch all question bank data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [questionsRes, topicsRes, companiesRes] = await Promise.all([
        getQuestions(),
        getTopics(),
        getCompanies(),
      ]);

      setQuestions(questionsRes.questions || []);
      setTopics(topicsRes.topics || []);
      setCompanies(companiesRes.companies || []);
    } catch (error) {
      console.error("Error fetching question bank data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filters if URL parameters change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      topic: searchParams.get("topic") || "",
      company: searchParams.get("company") || "",
    }));
  }, [searchParams]);
console.log("Search Query:", `"${searchQuery}"`);
console.log("Questions:", questions);
  // Client-side filtering
const filteredQuestions = questions.filter((q) => {
  const title = (q.title || "").toLowerCase().trim();
  const query = searchQuery.toLowerCase().trim();

  const matchesSearch =
    query === "" || title.includes(query);

  const matchesDifficulty =
    !filters.difficulty ||
    q.difficulty === filters.difficulty;

  const matchesTopic =
    !filters.topic ||
    (q.topic?._id || q.topic) === filters.topic;

  const matchesCompany =
    !filters.company ||
    (q.company?._id || q.company) === filters.company;

  return (
    matchesSearch &&
    matchesDifficulty &&
    matchesTopic &&
    matchesCompany
  );
});

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

        <QuestionTable questions={filteredQuestions} loading={loading} />
      </div>
    </MainLayout>
  );
};

export default Questions;