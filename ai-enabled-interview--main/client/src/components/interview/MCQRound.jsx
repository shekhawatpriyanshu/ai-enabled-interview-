import { useState } from "react";
import QuestionCard from "./QuestionCard";

const MCQRound = ({ interview, questions, setQuestions, onSubmit, submitting }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const handleAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage) || 1;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">
          Round 1: Technical MCQs
        </h2>
        <p className="text-slate-400">
          Answer the following multiple-choice questions to test your core knowledge. 
          <br/><span className="text-amber-400 font-semibold inline-block mt-2">Note: You must solve at least 50% of the questions correctly to proceed to the next round.</span>
        </p>
        <p className="text-cyan-400 mt-3 font-medium">
          Showing Questions {startIndex + 1} - {Math.min(endIndex, questions.length)} of {questions.length}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <QuestionCard
            key={startIndex + index}
            question={question}
            index={startIndex + index}
            onAnswerChange={handleAnswerChange}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-xl transition ${
                currentPage === index + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Submit Button */}
      {currentPage === totalPages && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl cursor-pointer font-semibold shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Submitting Round 1..." : "Submit & Proceed"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MCQRound;
