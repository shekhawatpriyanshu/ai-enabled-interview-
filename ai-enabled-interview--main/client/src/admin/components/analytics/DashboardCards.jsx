import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaCode,
  FaLaptopCode,
  FaCheckCircle,
  FaTrophy,
  FaUserCheck,
  FaComments,
  FaCommentDots,
  FaFileAlt,
} from "react-icons/fa";

import StatsCard from "./StatsCard";

const DashboardCards = ({ dashboard }) => {
  if (!dashboard) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <StatsCard
        title="Users"
        value={dashboard.users?.totalUsers}
        icon={<FaUsers />}
        bgGradient="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white hover:from-blue-100/90 hover:to-indigo-50"
        borderColor="border-blue-200/80 hover:border-blue-400"
        iconBg="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
        textClass="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Interviews"
        value={dashboard.interviews?.totalInterviews}
        icon={<FaUserTie />}
        bgGradient="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white hover:from-emerald-100/90 hover:to-teal-50"
        borderColor="border-emerald-200/80 hover:border-emerald-400"
        iconBg="bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30"
        textClass="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Tests"
        value={dashboard.tests?.totalTests}
        icon={<FaClipboardList />}
        bgGradient="bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-white hover:from-purple-100/90 hover:to-indigo-50"
        borderColor="border-purple-200/80 hover:border-purple-400"
        iconBg="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/30"
        textClass="bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Coding Problems"
        value={dashboard.coding?.totalCodingProblems}
        icon={<FaCode />}
        bgGradient="bg-gradient-to-br from-cyan-50/90 via-blue-50/50 to-white hover:from-cyan-100/90 hover:to-blue-50"
        borderColor="border-cyan-200/80 hover:border-cyan-400"
        iconBg="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-500/30"
        textClass="bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Coding Submissions"
        value={dashboard.coding?.codingSubmissions}
        icon={<FaLaptopCode />}
        bgGradient="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white hover:from-indigo-100/90 hover:to-purple-50"
        borderColor="border-indigo-200/80 hover:border-indigo-400"
        iconBg="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/30"
        textClass="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Accepted"
        value={dashboard.coding?.acceptedCoding}
        icon={<FaCheckCircle />}
        bgGradient="bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-white hover:from-teal-100/90 hover:to-emerald-50"
        borderColor="border-teal-200/80 hover:border-teal-400"
        iconBg="bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-teal-500/30"
        textClass="bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Contests"
        value={dashboard.contests?.totalContests}
        icon={<FaTrophy />}
        bgGradient="bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white hover:from-amber-100/90 hover:to-yellow-50"
        borderColor="border-amber-200/80 hover:border-amber-400"
        iconBg="bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-amber-500/30"
        textClass="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Participants"
        value={dashboard.contests?.contestParticipants}
        icon={<FaUserCheck />}
        bgGradient="bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-white hover:from-rose-100/90 hover:to-pink-50"
        borderColor="border-rose-200/80 hover:border-rose-400"
        iconBg="bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-rose-500/30"
        textClass="bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Discussions"
        value={dashboard.community?.totalDiscussions}
        icon={<FaComments />}
        bgGradient="bg-gradient-to-br from-sky-50/90 via-blue-50/50 to-white hover:from-sky-100/90 hover:to-blue-50"
        borderColor="border-sky-200/80 hover:border-sky-400"
        iconBg="bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-sky-500/30"
        textClass="bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Comments"
        value={dashboard.community?.totalComments}
        icon={<FaCommentDots />}
        bgGradient="bg-gradient-to-br from-fuchsia-50/90 via-purple-50/50 to-white hover:from-fuchsia-100/90 hover:to-purple-50"
        borderColor="border-fuchsia-200/80 hover:border-fuchsia-400"
        iconBg="bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white shadow-fuchsia-500/30"
        textClass="bg-gradient-to-r from-fuchsia-700 to-purple-700 bg-clip-text text-transparent"
      />

      <StatsCard
        title="Resume Uploads"
        value={dashboard.resumes?.totalResumeUploads}
        icon={<FaFileAlt />}
        bgGradient="bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-white hover:from-orange-100/90 hover:to-amber-50"
        borderColor="border-orange-200/80 hover:border-orange-400"
        iconBg="bg-gradient-to-tr from-orange-500 to-amber-600 text-white shadow-orange-500/30"
        textClass="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent"
      />
    </div>
  );
};

export default DashboardCards;