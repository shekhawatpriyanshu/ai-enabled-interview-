import {
  FileCode2,
  Clock3,
  Trophy,
  CalendarDays,
} from "lucide-react";

const ContestStats = ({ contest }) => {
  const stats = [
    {
      title: "Problems",
      value: contest.problems?.length || 0,
      icon: FileCode2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Duration",
      value: `${contest.duration} mins`,
      icon: Clock3,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Status",
      value: contest.status,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Start Date",
      value: new Date(
        contest.startTime
      ).toLocaleDateString(),
      icon: CalendarDays,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bg}`}
            >
              <Icon
                className={item.color}
                size={24}
              />
            </div>

            <h4 className="text-gray-500 text-sm mt-5">
              {item.title}
            </h4>

            <p className="text-xl font-bold mt-1 text-gray-900 break-words">
              {item.value}
            </p>
          </div>
        );
      })}

    </div>
  );
};

export default ContestStats;