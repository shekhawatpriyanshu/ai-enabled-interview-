import {
  FaClipboardList,
  FaQuestionCircle,
  FaClock,
  FaStar,
} from "react-icons/fa";

const MockTestStats = ({ tests = [] }) => {
  const totalTests = tests.length;

  const totalQuestions = tests.reduce(
    (sum, test) => sum + (test.questions?.length || 0),
    0
  );

  const totalMarks = tests.reduce(
    (sum, test) => sum + (test.totalMarks || 0),
    0
  );

  const averageDuration =
    totalTests > 0
      ? Math.round(
          tests.reduce(
            (sum, test) => sum + (test.duration || 0),
            0
          ) / totalTests
        )
      : 0;

  const stats = [
    {
      title: "Total Mock Tests",
      value: totalTests,
      icon: <FaClipboardList size={22} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Total Questions",
      value: totalQuestions,
      icon: <FaQuestionCircle size={22} />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Average Duration",
      value: `${averageDuration} min`,
      icon: <FaClock size={22} />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: "Total Marks",
      value: totalMarks,
      icon: <FaStar size={22} />,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow border p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-gray-500">
              {item.title}
            </p>

            <h2 className="text-3xl font-bold mt-2 text-gray-800">
              {item.value}
            </h2>
          </div>

          <div
            className={`${item.bg} ${item.text} p-4 rounded-full`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MockTestStats;