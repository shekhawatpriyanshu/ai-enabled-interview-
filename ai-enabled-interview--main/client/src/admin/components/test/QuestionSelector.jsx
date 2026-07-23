import { useEffect, useMemo, useState } from "react";

import useMockTest from "../../../admin/hooks/useMockTest";

const QuestionSelector = ({
  selectedQuestions = [],
  onChange,
}) => {
  const { questions, loading, loadQuestions } =
    useMockTest();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] =
    useState("");

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

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [questions, search, difficulty]);

  const isSelected = (id) =>
    selectedQuestions.includes(id);

  const handleSelect = (id) => {
    if (isSelected(id)) {
      onChange(
        selectedQuestions.filter(
          (item) => item !== id
        )
      );
    } else {
      onChange([
        ...selectedQuestions,
        id,
      ]);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold">
          Select Questions
        </h3>

        <span className="text-sm font-medium text-blue-600">
          Selected :
          {" "}
          {selectedQuestions.length}
        </span>

      </div>

      {/* Search */}

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Search question..."
          className="border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
        >
          <option value="">
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

      {/* Question List */}

      <div className="border rounded-lg max-h-[500px] overflow-y-auto">

        {loading ? (
          <div className="p-5 text-center">
            Loading Questions...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            No Questions Found
          </div>
        ) : (
          filteredQuestions.map(
            (question) => (
              <label
                key={question._id}
                className="flex gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={isSelected(
                    question._id
                  )}
                  onChange={() =>
                    handleSelect(
                      question._id
                    )
                  }
                  className="mt-1"
                />

                <div className="flex-1">

                  <div className="flex justify-between">

                    <h4 className="font-semibold">
                      {question.title}
                    </h4>

                    <span
                      className={`text-xs px-2 py-1 rounded-full
                      ${
                        question.difficulty ===
                        "Easy"
                          ? "bg-green-100 text-green-700"
                          : question.difficulty ===
                            "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.difficulty}
                    </span>

                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {question.question}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">

                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Topic :
                      {" "}
                      {question.topic?.name}
                    </span>

                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Company :
                      {" "}
                      {question.company?.name}
                    </span>

                  </div>

                </div>

              </label>
            )
          )
        )}

      </div>

    </div>
  );
};

export default QuestionSelector;