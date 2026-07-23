import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const Console = ({
  output,
  expectedOutput,
  status,
  score,
  runtime,
  memory,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "Accepted":
        return "text-green-600"  ;

      case "Wrong Answer":
        return "text-red-600";

      case "Runtime Error":
        return "text-orange-600";

      case "Compilation Error":
        return "text-yellow-600";

      case "Time Limit Exceeded":
        return "text-purple-600";

      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle />;

      case "Wrong Answer":
      case "Runtime Error":
      case "Compilation Error":
      case "Time Limit Exceeded":
        return <FaTimesCircle />;

      default:
        return <FaClock />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md mt-6">

      {/* Header */}

      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">
          Console
        </h2>
      </div>

      <div className="p-5 space-y-6">

        {/* Output */}

        <div>

          <label className="font-semibold text-gray-700 block mb-2">
            Output
          </label>

          <pre
            className={`rounded-xl p-4 min-h-[120px] overflow-auto whitespace-pre-wrap ${
              status === "Compilation Error" ||
              status === "Runtime Error"
                ? "bg-red-900 text-red-200"
                : "bg-slate-900 text-green-400"
            }`}
          >
            {output || "Run your code to see output..."}
          </pre>

        </div>

        {/* Expected Output */}

        {expectedOutput && (
          <div>

            <label className="font-semibold text-gray-700 block mb-2">
              Expected Output
            </label>

            <pre className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 whitespace-pre-wrap">
              {expectedOutput}
            </pre>

          </div>
        )}

        {/* Result Cards */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-slate-100 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Status
            </p>

            <div
              className={`mt-2 flex items-center gap-2 font-semibold ${getStatusColor()}`}
            >
              {getStatusIcon()}
              {status || "--"}
            </div>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Score
            </p>

            <h3 className="text-xl font-bold mt-2">
              {score || "--"}
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Runtime
            </p>

            <h3 className="text-xl font-bold mt-2">
              {runtime || "--"}
            </h3>

          </div>

          <div className="bg-slate-100 rounded-xl p-4">

            <p className="text-gray-500 text-sm">
              Memory
            </p>

            <h3 className="text-xl font-bold mt-2">
              {memory || "--"}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Console;