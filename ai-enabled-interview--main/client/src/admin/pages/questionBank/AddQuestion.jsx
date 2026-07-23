import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaPlusCircle,
  FaCode,
} from "react-icons/fa";

import QuestionForm from "../../components/questionBank/QuesionForm";
import useQuestion from "../../hooks/useQuestion";

const AddQuestion = () => {
  const navigate = useNavigate();

  const { addQuestion } = useQuestion();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await addQuestion(formData);

      toast.success("Question created successfully.");

      navigate("/admin/questions");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create question."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}

      <div className="mb-8">

        <button
          onClick={() => navigate("/admin/questions")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          <FaArrowLeft />
          Back to Questions
        </button>

      </div>

      {/* Hero Card */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 p-8 text-white shadow-2xl">

        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>

        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-purple-400/20 blur-3xl"></div>

        <div className="relative z-10 flex justify-between items-center flex-wrap gap-6">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="bg-white/20 p-3 rounded-xl">

                <FaPlusCircle className="text-3xl" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Add New Question
                </h1>

                <p className="text-indigo-100 mt-2 max-w-2xl">
                  Create structured interview questions,
                  coding problems, MCQs, examples,
                  constraints, hints, and solutions for
                  your Question Bank.
                </p>

              </div>

            </div>

          </div>

          <div className="hidden lg:flex">

            <FaCode className="text-[120px] text-white/20" />

          </div>

        </div>

      </div>

      {/* Form Card */}

      <div className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

        <div className="border-b px-8 py-5 bg-slate-50">

          <h2 className="text-2xl font-semibold text-slate-800">
            Question Details
          </h2>

          <p className="text-slate-500 mt-1">
            Fill all required information before
            publishing the interview question.
          </p>

        </div>

        <div className="p-8">

          <QuestionForm
            onSubmit={handleSubmit}
            loading={loading}
          />

        </div>

      </div>

      {/* Tips */}

      <div className="mt-8 grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition">

          <h3 className="font-bold text-lg mb-3 text-indigo-600">
            💡 Best Practice
          </h3>

          <p className="text-slate-600">
            Keep the question title concise and easy
            to search.
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition">

          <h3 className="font-bold text-lg mb-3 text-green-600">
            📚 Examples
          </h3>

          <p className="text-slate-600">
            Add multiple examples to improve user
            understanding.
          </p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition">

          <h3 className="font-bold text-lg mb-3 text-red-600">
            ⚡ Difficulty
          </h3>

          <p className="text-slate-600">
            Choose the appropriate difficulty level
            for better filtering.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AddQuestion;