import { useEffect } from "react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor your platform performance, users and engagement.</p>
        </div>
      </div>

    {/* KPI Cards */}

    <DashboardCards dashboard={dashboard} />

    {/* Quick Stats */}

    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition">

        <h3 className="text-gray-500 text-sm">
          Total Users
        </h3>

        <h2 className="text-4xl font-bold mt-2 text-blue-600">
          {dashboard.users.totalUsers}
        </h2>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition">

        <h3 className="text-gray-500 text-sm">
          Active Users
        </h3>

        <h2 className="text-4xl font-bold mt-2 text-green-600">
          {dashboard.users.activeUsers}
        </h2>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition">

        <h3 className="text-gray-500 text-sm">
          Interviews
        </h3>

        <h2 className="text-4xl font-bold mt-2 text-purple-600">
          {dashboard.interviews.totalInterviews}
        </h2>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition">

        <h3 className="text-gray-500 text-sm">
          Coding Problems
        </h3>

        <h2 className="text-4xl font-bold mt-2 text-pink-600">
          {dashboard.coding.totalCodingProblems}
        </h2>

      </div>

    </div>

    {/* Analytics */}

    <div className="grid gap-6">
      {userAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <UserAnalyticsCard analytics={userAnalytics} />
        </div>
      )}

      {interviewAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <InterviewAnalyticsCard analytics={interviewAnalytics} />
        </div>
      )}

      {codingAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <CodingAnalyticsCard analytics={codingAnalytics} />
        </div>
      )}

      {resumeAnalytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <ResumeAnalyticsCard analytics={resumeAnalytics} />
        </div>
      )}
    </div>

  </div>
);
};

export default AnalyticsDashboard;