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
    loadAllAnalytics,
  } = useAdminAnalytics();

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  if (loading && !dashboard) {
    return <LoadingSkeleton />;
  }

  if (!dashboard && !loading) {
    return (
      <ErrorCard
        title="Analytics Dashboard"
        message="Unable to load dashboard data right now. Please try again."
        onRetry={() => loadAllAnalytics(true)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
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

      {/* KPI Cards */}
      {dashboard && <DashboardCards dashboard={dashboard} />}

      {/* Analytics Breakdown Cards */}
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