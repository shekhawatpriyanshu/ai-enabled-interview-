import {
  FaClipboardList,
  FaCheckCircle,
  FaPlayCircle,
  FaStar,
} from "react-icons/fa";

const InterviewStats = ({ stats }) => {
  const cards = [
    {
      title: "Total Interviews",
      value: stats?.total || 0,
      icon: <FaClipboardList />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: <FaCheckCircle />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Started",
      value: stats?.started || 0,
      icon: <FaPlayCircle />,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Average Score",
      value: stats?.averageScore || 0,
      icon: <FaStar />,
      bg: "bg-purple-100",
      color: "text-purple-600",
      
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.bg} ${card.color} h-14 w-14 rounded-full flex items-center justify-center text-2xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewStats;