// src/components/analytics/AnalyticsStats.jsx

import {
  FaBookOpen,
  FaCode,
  FaClipboardCheck,
  FaTrophy,
  FaMicrophone,
  FaStar,
} from "react-icons/fa";

import StatCard from "./StatCard";

const AnalyticsStats = ({ analytics }) => {
  const stats = [
    {
      title: "Questions Solved",
      value: analytics?.questionsSolved || 0,
      icon: <FaBookOpen />,
      color: "blue",
    },
    {
      title: "Coding Solved",
      value: analytics?.codingSolved || 0,
      icon: <FaCode />,
      color: "emerald",
    },
    {
      title: "Tests Completed",
      value: analytics?.testsCompleted || 0,
      icon: <FaClipboardCheck />,
      color: "amber",
    },
    {
      title: "Contests Joined",
      value: analytics?.contestsParticipated || 0,
      icon: <FaTrophy />,
      color: "rose",
    },
    {
      title: "Interviews Completed",
      value: analytics?.interviewsCompleted || 0,
      icon: <FaMicrophone />,
      color: "cyan",
    },
    {
      title: "Total Score",
      value: analytics?.totalScore || 0,
      icon: <FaStar />,
      color: "indigo",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default AnalyticsStats;