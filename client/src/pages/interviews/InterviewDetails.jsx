import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import QuestionCard from "../../components/interview/QuestionCard";

import {
  getInterview,
  submitInterview,
} from "../../services/InterviewService";

const InterviewDetails = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [interview, setInterview] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const questionsPerPage =
    10;

  useEffect(() => {
    loadInterview();
  }, []);

  const loadInterview =
    async () => {
      try {
        const data =
          await getInterview(id);

        setInterview(
          data.interview
        );

        setQuestions(
          data.interview.questions ||
            []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleAnswerChange = (
    index,
    value
  ) => {
    const updated =
      [...questions];

    updated[index].answer =
      value;

    setQuestions(updated);
  };

  const handleSubmit =
    async () => {
      try {
        setSubmitting(true);

        await submitInterview(
          id,
          questions
        );

        navigate(
          `/interviews/feedback/${id}`
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to submit interview"
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center min-h-screen text-xl">
          Loading...
        </div>
      </MainLayout>
    );
  }

  const totalPages =
    Math.ceil(
      questions.length /
        questionsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    questionsPerPage;

  const endIndex =
    startIndex +
    questionsPerPage;

  const currentQuestions =
    questions.slice(
      startIndex,
      endIndex
    );

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-5xl mx-auto py-10 px-4">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white">
            {interview.role}
            {" "}
            Interview
          </h1>

          <p className="text-slate-400 mt-2">
            {
              interview.experienceLevel
            }
          </p>

          <p className="text-cyan-400 mt-3 font-medium">
            Showing Questions{" "}
            {startIndex + 1}
            {" - "}
            {Math.min(
              endIndex,
              questions.length
            )}
            {" of "}
            {
              questions.length
            }
          </p>

        </div>

        {/* Questions */}

        <div className="space-y-6">

          {currentQuestions.map(
            (
              question,
              index
            ) => (
              <QuestionCard
                key={
                  startIndex +
                  index
                }
                question={
                  question
                }
                index={
                  startIndex +
                  index
                }
                onAnswerChange={
                  handleAnswerChange
                }
              />
            )
          )}

        </div>

        {/* Pagination */}

        <div className="flex flex-wrap justify-center items-center gap-3 mt-10">

          <button
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev - 1
              )
            }
            disabled={
              currentPage === 1
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-800
              text-white
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Previous
          </button>

          {[...Array(totalPages)]
            .map(
              (
                _,
                index
              ) => (
                <button
                  key={
                    index
                  }
                  onClick={() =>
                    setCurrentPage(
                      index +
                        1
                    )
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    transition
                    ${
                      currentPage ===
                      index +
                        1
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300"
                    }
                  `}
                >
                  {index + 1}
                </button>
              )
            )}

          <button
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev + 1
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-800
              text-white
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Next
          </button>

        </div>

        {/* Submit Button */}

        {currentPage ===
          totalPages && (
          <div className="mt-12 flex justify-center">

            <button
              onClick={
                handleSubmit
              }
              disabled={
                submitting
              }
              className="
                bg-gradient-to-r
                from-cyan-500
                to-purple-600
                text-white
                px-10
                py-4
                rounded-xl
                font-semibold
                shadow-lg
                hover:scale-105
                transition-all
                duration-300
                disabled:opacity-50
              "
            >
              {submitting
                ? "Submitting..."
                : "Submit Interview"}
            </button>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default InterviewDetails;