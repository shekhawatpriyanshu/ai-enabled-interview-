import {
  FaClock,
  FaPaperPlane,
  FaClipboardCheck,
} from "react-icons/fa";

const TestHeader = ({
  test,
  currentQuestion,
  totalQuestions,
  answeredCount,
  timeLeft,
  onSubmit,
}) => {
  // Convert seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = String(
      Math.floor(seconds / 3600)
    ).padStart(2, "0");

    const mins = String(
      Math.floor((seconds % 3600) / 60)
    ).padStart(2, "0");

    const secs = String(
      seconds % 60
    ).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  const progress =
    totalQuestions > 0
      ? Math.round(
          (answeredCount / totalQuestions) * 100
        )
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-4 z-20">

      {/* Top */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

        {/* Test Info */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            {test?.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {test?.description}
          </p>

        </div>

        {/* Timer */}

        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 flex items-center gap-3">

          <FaClock className="text-red-600 text-2xl" />

          <div>

            <p className="text-sm text-gray-500">
              Time Remaining
            </p>

            <h2 className="text-2xl font-bold text-red-600">
              {formatTime(timeLeft)}
            </h2>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

        {/* Progress */}

        <div className="flex flex-wrap gap-6">

          <div>

            <p className="text-gray-500 text-sm">
              Current Question
            </p>

            <h3 className="font-bold text-lg">
              {currentQuestion + 1} / {totalQuestions}
            </h3>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Answered
            </p>

            <h3 className="font-bold text-lg text-green-600">
              {answeredCount}
            </h3>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Progress
            </p>

            <h3 className="font-bold text-lg text-cyan-600">
              {progress}%
            </h3>

          </div>

        </div>

        {/* Submit */}

        <button
          onClick={onSubmit}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          <FaPaperPlane />
          Submit Test
        </button>

      </div>

      {/* Progress Bar */}

      <div className="mt-6">

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-cyan-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-4 flex items-center gap-2 text-gray-500">

        <FaClipboardCheck />

        <span>
          Answer all questions before submitting.
        </span>

      </div>

    </div>
  );
};

export default TestHeader;