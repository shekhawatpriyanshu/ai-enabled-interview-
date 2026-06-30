import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  getTest,
  submitTest,
} from "../../services/TestService";

import {
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [test, setTest] = useState(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadTest();
  }, []);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && test) {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadTest = async () => {
    try {
      setLoading(true);

      const res = await getTest(id);

      setTest(res.test);

      setTimeLeft(res.test.duration * 60);
    } catch (error) {
      toast.error("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const question =
    test?.questions[currentQuestion];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [question._id]: value,
    });
  };

  const nextQuestion = () => {
    if (
      currentQuestion <
      test.questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers =
        Object.keys(answers).map((id) => ({
          question: id,
          answer: answers[id],
        }));

      await submitTest({
        testId: id,
        answers: formattedAnswers,
      });

      toast.success("Test Submitted");

      navigate("/tests/submissions");
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(
      timeLeft / 60
    );

    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center h-screen">
          Loading Test...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="grid lg:grid-cols-4 gap-6">

        {/* Left */}

        <div className="lg:col-span-3">

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center">

              <div>

                <h1 className="text-3xl font-bold">
                  {test.title}
                </h1>

                <p className="text-gray-500 mt-2">
                  Question {currentQuestion + 1} of{" "}
                  {test.questions.length}
                </p>

              </div>

              <div className="flex items-center gap-3 bg-red-100 text-red-600 px-4 py-2 rounded-xl">

                <FaClock />

                <span className="font-bold">
                  {formatTime()}
                </span>

              </div>

            </div>

            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                {question.question}
              </h2>

              <div className="space-y-4 mt-6">

                {question.options.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswer(option)
                      }
                      className={`w-full text-left p-4 rounded-xl border transition
                      ${
                        answers[
                          question._id
                        ] === option
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "hover:border-cyan-500"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}

              </div>

            </div>

            <div className="flex justify-between mt-10">

              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
              >
                <FaArrowLeft />

                Previous
              </button>

              {currentQuestion ===
              test.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  <FaCheckCircle />

                  Submit Test
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  Next

                  <FaArrowRight />
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Right */}

        <div>

          <div className="bg-white rounded-2xl shadow p-5 sticky top-5">

            <h3 className="font-bold text-xl mb-5">
              Questions
            </h3>

            <div className="grid grid-cols-5 gap-3">

              {test.questions.map(
                (q, index) => (
                  <button
                    key={q._id}
                    onClick={() =>
                      setCurrentQuestion(index)
                    }
                    className={`h-11 rounded-lg font-semibold
                    ${
                      answers[q._id]
                        ? "bg-green-500 text-white"
                        : currentQuestion === index
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

            </div>

            <button
              onClick={handleSubmit}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
            >
              Finish Test
            </button>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default TestDetails;