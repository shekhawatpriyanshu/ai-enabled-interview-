import { useEffect } from "react";

import { FaChartBar } from "react-icons/fa";
import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import DashboardCards from "../../components/analytics/DashboardCards";

import UserAnalyticsCard from "../../components/analytics/UserAnalyticsCard";

import InterviewAnalyticsCard from "../../components/analytics/InterviewAnalyticsCard";

import CodingAnalyticsCard from "../../components/analytics/CodingAnalyticsCard";

import ResumeAnalyticsCard from "../../components/analytics/ResumeAnalyticsCard";

import LoadingSkeleton from "../../components/analytics/LoadingSkeleton";

import ErrorCard from "../../components/analytics/ErrorCard";

const AnalyticsDashboard = () => {

    const {

        loading,

        dashboard,

        userAnalytics,

        interviewAnalytics,

        codingAnalytics,

        resumeAnalytics,

        getDashboard,

        getUsers,

        getInterviews,

        getCoding,

        getResume,

    } = useAdminAnalytics();

    useEffect(() => {

        getDashboard();

        getUsers();

        getInterviews();

        getCoding();

        getResume();

    }, []);

    if (loading) {

        return <LoadingSkeleton />;

    }

    if (!dashboard) {

        return (

            <ErrorCard

                title="Analytics Dashboard"

                message="Unable to load dashboard."

            />

        );

    }
        const cards = [

        {
            title: "Users",
            value: dashboard.users.totalUsers,
            color: "bg-blue-500",
        },

        {
            title: "Interviews",
            value: dashboard.interviews.totalInterviews,
            color: "bg-green-500",
        },

        {
            title: "Tests",
            value: dashboard.tests.totalTests,
            color: "bg-yellow-500",
        },

        {
            title: "Coding Problems",
            value: dashboard.coding.totalCodingProblems,
            color: "bg-purple-500",
        },

        {
            title: "Contests",
            value: dashboard.contests.totalContests,
            color: "bg-pink-500",
        },

        {
            title: "Resume Uploads",
            value: dashboard.resumes.totalResumeUploads,
            color: "bg-red-500",
        },
    ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <FaChartBar className="text-indigo-600 text-3xl sm:text-4xl drop-shadow-sm hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5">
            Monitor real-time platform performance, user engagement, and core system metrics.
          </p>
        </div>
      </div>

    {/* KPI Cards */}

    <DashboardCards dashboard={dashboard} />



    {/* Analytics */}

    <div className="grid gap-6">
      {userAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
          <UserAnalyticsCard analytics={userAnalytics} />
        </div>
      )}

      {interviewAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
          <InterviewAnalyticsCard analytics={interviewAnalytics} />
        </div>
      )}

      {codingAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
          <CodingAnalyticsCard analytics={codingAnalytics} />
        </div>
      )}

      {resumeAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300">
          <ResumeAnalyticsCard analytics={resumeAnalytics} />
        </div>
      )}
    </div>

  </div>
);
};

export default AnalyticsDashboard;