import {
  FaTrophy,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
  FaCode,
} from "react-icons/fa";

const ContestStats = ({ contests = [] }) => {
  const totalContests = contests.length;

  const upcomingContests = contests.filter(
    (contest) => contest.status === "Upcoming"
  ).length;

  const liveContests = contests.filter(
    (contest) => contest.status === "Live"
  ).length;

  const completedContests = contests.filter(
    (contest) => contest.status === "Completed"
  ).length;

  const totalProblems = contests.reduce(
    (total, contest) =>
      total + (contest.problems?.length || 0),
    0
  );

  const stats = [
    {
      title: "Total Contests",
      value: totalContests,
      icon: <FaTrophy size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Upcoming",
      value: upcomingContests,
      icon: <FaClock size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "Live",
      value: liveContests,
      icon: <FaPlayCircle size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Completed",
      value: completedContests,
      icon: <FaCheckCircle size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Problems Used",
      value: totalProblems,
      icon: <FaCode size={24} />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-gray-500">
              {item.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {item.value}
            </h2>
          </div>

          <div
            className={`${item.color} text-white p-4 rounded-full`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContestStats;