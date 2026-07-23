import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaSignal,
  FaQuestionCircle,
  FaStar,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

import useMockTest from "../../../admin/hooks/useMockTest";

const MockTestDetails = () => {
  const { id } = useParams();

  const {
    loading,
    test,
    loadMockTest,
  } = useMockTest();

  useEffect(() => {
    if (id) {
      loadMockTest(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <p className="text-lg text-gray-500">
          Loading Mock Test...
        </p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-72">
        <h2 className="text-2xl font-bold text-red-600">
          Mock Test Not Found
        </h2>

        <Link
          to="/admin/mock-tests"
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <Link
            to="/admin/mock-tests"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3"
          >
            <FaArrowLeft />

            Back
          </Link>

          <h1 className="text-3xl font-bold">
            {test.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {test.description || "No description available."}
          </p>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Duration */}

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Duration
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {test.duration} min
              </h3>

            </div>

            <FaClock
              className="text-blue-600"
              size={28}
            />

          </div>

        </div>

        {/* Difficulty */}

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Difficulty
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {test.difficulty}
              </h3>

            </div>

            <FaSignal
              className="text-green-600"
              size={28}
            />

          </div>

        </div>

        {/* Questions */}

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Questions
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {test.questions?.length || 0}
              </h3>

            </div>

            <FaQuestionCircle
              className="text-purple-600"
              size={28}
            />

          </div>

        </div>

        {/* Marks */}

        <div className="bg-white rounded-lg shadow p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Total Marks
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {test.totalMarks}
              </h3>

            </div>

            <FaStar
              className="text-yellow-500"
              size={28}
            />

          </div>

        </div>

      </div>

      {/* Test Information */}

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Test Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <div className="flex items-center gap-3 mb-5">

              <FaUser className="text-gray-500" />

              <div>

                <p className="text-sm text-gray-500">
                  Created By
                </p>

                <h4 className="font-semibold">
                  {test.createdBy?.name || "Admin"}
                </h4>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <FaCalendarAlt className="text-gray-500" />

              <div>

                <p className="text-sm text-gray-500">
                  Created At
                </p>

                <h4 className="font-semibold">
                  {new Date(
                    test.createdAt
                  ).toLocaleDateString()}
                </h4>

              </div>

            </div>

          </div>

          <div>

            <div className="mb-5">

              <p className="text-sm text-gray-500">
                Description
              </p>

              <p className="mt-2 leading-7">
                {test.description ||
                  "No description available."}
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* Questions */}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">
          Questions ({test.questions?.length || 0})
        </h2>

        {!test.questions || test.questions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No questions added to this mock test.
          </div>
        ) : (
          <div className="space-y-6">
            {test.questions.map((question, index) => (
              <div
                key={question._id}
                className="border rounded-lg p-5"
              >
                {/* Header */}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Q{index + 1}.{" "}
                      {question.title}
                    </h3>

                    <p className="mt-2 text-gray-700">
                      {question.question}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : question.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                {/* Topic & Company */}

                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Topic :{" "}
                    {question.topic?.name ||
                      "N/A"}
                  </span>

                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    Company :{" "}
                    {question.company?.name ||
                      "N/A"}
                  </span>
                </div>

                {/* Options */}

                {question.options &&
                  question.options.length >
                    0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">
                        Options
                      </h4>

                      <div className="space-y-3">
                        {question.options.map(
                          (
                            option,
                            optionIndex
                          ) => (
                            <div
                              key={
                                optionIndex
                              }
                              className={`border rounded-lg p-3
                              ${
                                option ===
                                question.correctAnswer
                                  ? "border-green-500 bg-green-50"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                                  . {option}
                                </span>

                                {option ===
                                  question.correctAnswer && (
                                  <span className="text-green-600 text-sm font-semibold">
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

                {/* Answer */}

                {!question.options?.length && (
                  <div className="mt-6">
                    <h4 className="font-medium">
                      Answer
                    </h4>

                    <p className="mt-2 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700">
                      {question.answer ||
                        question.correctAnswer}
                    </p>
                  </div>
                )}

                {/* Tags */}

                {question.tags?.length >
                  0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">
                      Tags
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {question.tags.map(
                        (
                          tag,
                          tagIndex
                        ) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="flex justify-end">
        <Link
          to="/admin/mock-tests"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
        >
          Back to Mock Tests
        </Link>
      </div>
    </div>
  );
};

export default MockTestDetails;