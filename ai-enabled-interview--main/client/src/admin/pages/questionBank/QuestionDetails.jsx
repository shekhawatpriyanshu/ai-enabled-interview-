import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaHeart,
} from "react-icons/fa";

import useQuestion from "../../hooks/useQuestion";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchQuestion } = useQuestion();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      setLoading(true);

      const data = await fetchQuestion(id);

      setQuestion(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load question."
      );

      navigate("/admin/questions");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = () => {
    switch (question?.difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Hard":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Question...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-10 text-center">
        Question not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Question Details
          </h1>

          <p className="text-gray-500">
            Complete interview question information
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            to="/admin/questions"
            className="px-4 py-2 rounded-lg border flex items-center gap-2"
          >
            <FaArrowLeft />
            Back
          </Link>

          <Link
            to={`/admin/questions/edit/${question._id}`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
          >
            <FaEdit />
            Edit
          </Link>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-white shadow rounded-lg p-5">

          <div className="flex items-center gap-3">

            <FaEye className="text-blue-600 text-xl" />

            <div>

              <p className="text-gray-500">
                Views
              </p>

              <h2 className="text-2xl font-bold">
                {question.views}
              </h2>

            </div>

          </div>

        </div>

        <div className="bg-white shadow rounded-lg p-5">

          <p className="text-gray-500">
            Difficulty
          </p>

          <span
            className={`inline-block mt-3 px-4 py-2 rounded-full font-semibold ${badgeColor()}`}
          >
            {question.difficulty}
          </span>

        </div>

      </div>

      {/* Basic Information */}

      <div className="bg-white shadow rounded-xl p-6 space-y-5">

        <div>

          <label className="font-semibold text-gray-600">
            Title
          </label>

          <h2 className="text-2xl font-bold mt-1">
            {question.title}
          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-semibold text-gray-600">
              Topic
            </label>

            <p className="mt-1">
              {question.topic?.name}
            </p>

          </div>

          <div>

            <label className="font-semibold text-gray-600">
              Company
            </label>

            <p className="mt-1">
              {question.company?.name}
            </p>

          </div>

        </div>

        <div>

          <label className="font-semibold text-gray-600">
            Description
          </label>

          <div className="mt-2 p-4 rounded-lg bg-gray-50 whitespace-pre-wrap">
            {question.description ||
              "No description available."}
          </div>

        </div>

        <div>

          <label className="font-semibold text-gray-600">
            Interview Question
          </label>

          <div className="mt-2 p-4 rounded-lg bg-gray-50 whitespace-pre-wrap">
            {question.question}
          </div>

        </div>

        <div>

          <label className="font-semibold text-gray-600">
            Answer
          </label>

          <div className="mt-2 p-4 rounded-lg bg-green-50 whitespace-pre-wrap">
            {question.answer}
          </div>

        </div>

      </div>
            {/* Tags */}

      {question.tags?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Tags
          </h2>

          <div className="flex flex-wrap gap-3">

            {question.tags.map((tag, index) => (

              <span
                key={index}
                className="px-4 py-2 rounded-full bg-blue-100 text-blue-700"
              >
                {tag}
              </span>

            ))}

          </div>

        </div>
      )}

      {/* Examples */}

      {question.examples?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Examples
          </h2>

          <div className="space-y-6">

            {question.examples.map((example, index) => (

              <div
                key={index}
                className="border rounded-lg p-5 bg-gray-50"
              >

                <h3 className="font-semibold text-lg mb-4">
                  Example {index + 1}
                </h3>

                <div className="space-y-4">

                  <div>

                    <label className="font-medium">
                      Input
                    </label>

                    <pre className="mt-2 bg-white p-3 rounded border whitespace-pre-wrap">
                      {example.input}
                    </pre>

                  </div>

                  <div>

                    <label className="font-medium">
                      Output
                    </label>

                    <pre className="mt-2 bg-white p-3 rounded border whitespace-pre-wrap">
                      {example.output}
                    </pre>

                  </div>

                  <div>

                    <label className="font-medium">
                      Explanation
                    </label>

                    <pre className="mt-2 bg-white p-3 rounded border whitespace-pre-wrap">
                      {example.explanation}
                    </pre>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* Constraints */}

      {question.constraints?.length > 0 && (

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Constraints
          </h2>

          <ul className="list-disc pl-6 space-y-2">

            {question.constraints.map(
              (constraint, index) => (

                <li key={index}>
                  {constraint}
                </li>

              )
            )}

          </ul>

        </div>

      )}

      {/* Hints */}

      {question.hints?.length > 0 && (

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Hints
          </h2>

          <ul className="list-disc pl-6 space-y-2">

            {question.hints.map(
              (hint, index) => (

                <li key={index}>
                  {hint}
                </li>

              )
            )}

          </ul>

        </div>

      )}

      {/* MCQ */}

      {question.options?.length > 0 && (

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Multiple Choice Options
          </h2>

          <div className="space-y-3">

            {question.options.map(
              (option, index) => (

                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    option === question.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-50"
                  }`}
                >

                  <div className="flex justify-between">

                    <span>{option}</span>

                    {option ===
                      question.correctAnswer && (

                      <span className="font-semibold text-green-700">
                        Correct Answer
                      </span>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

      {/* Metadata */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Metadata
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-semibold text-gray-600">
              Created By
            </label>

            <p className="mt-1">
              {question.createdBy?.name || "Admin"}
            </p>

          </div>

          <div>

            <label className="font-semibold text-gray-600">
              Created At
            </label>

            <p className="mt-1">
              {new Date(
                question.createdAt
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <label className="font-semibold text-gray-600">
              Updated At
            </label>

            <p className="mt-1">
              {new Date(
                question.updatedAt
              ).toLocaleString()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuestionDetails;