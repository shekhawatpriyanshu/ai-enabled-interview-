import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaCheck, FaQuestionCircle, FaBolt } from "react-icons/fa";
import useMockTest from "../../../admin/hooks/useMockTest";

const QuestionSelector = ({
  selectedQuestions = [],
  onChange,
}) => {
  const { questions, loading, loadQuestions } = useMockTest();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.question
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "" ||
        item.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [questions, search, difficulty]);

  const isSelected = (id) => selectedQuestions.includes(id);

  const handleSelect = (id) => {
    if (isSelected(id)) {
      onChange(selectedQuestions.filter((item) => item !== id));
    } else {
      onChange([...selectedQuestions, id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <FaQuestionCircle className="text-indigo-600" /> Select Questions Repository
        </h4>

        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          Selected: {selectedQuestions.length} Questions
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs shadow-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaBolt className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <select
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs cursor-pointer shadow-xs"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="" className="bg-white font-normal text-slate-800 py-1">
              All Difficulty
            </option>
            <option value="Easy" className="bg-white font-normal text-slate-800 py-1">
              Easy
            </option>
            <option value="Medium" className="bg-white font-normal text-slate-800 py-1">
              Medium
            </option>
            <option value="Hard" className="bg-white font-normal text-slate-800 py-1">
              Hard
            </option>
          </select>
        </div>
      </div>

      {/* Question List */}
      <div className="border border-slate-200/90 rounded-2xl max-h-[420px] overflow-y-auto divide-y divide-slate-100 bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs font-semibold uppercase tracking-wider animate-pulse">
            Loading Questions...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No Questions Match Criteria
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const active = isSelected(question._id);
            return (
              <div
                key={question._id}
                onClick={() => handleSelect(question._id)}
                className={`flex items-start gap-3.5 p-4 transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-indigo-50/70 border-l-4 border-indigo-600"
                    : "hover:bg-slate-50/80 border-l-4 border-transparent"
                }`}
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  active ? "bg-indigo-600 border-indigo-600 text-white shadow-xs" : "border-slate-300 bg-white"
                }`}>
                  {active && <FaCheck size={10} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                      {question.title}
                    </h5>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${
                        question.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : question.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>

                  {question.question && (
                    <p className="text-xs text-slate-500 font-normal mt-1 line-clamp-1">
                      {question.question}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium">
                    {question.topic?.name && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md">
                        Topic: {question.topic.name}
                      </span>
                    )}

                    {question.company?.name && (
                      <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-2 py-0.5 rounded-md">
                        Company: {question.company.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestionSelector;