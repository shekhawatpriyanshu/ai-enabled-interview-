import { useEffect } from "react";

import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import InterviewAnalyticsCard from "../../components/analytics/InterviewAnalyticsCard";

import AnalyticsTable from "../../components/analytics/AnalyticsTable";

import ProgressBar from "../../components/analytics/ProgressBar";

import LoadingSkeleton from "../../components/analytics/LoadingSkeleton";

import EmptyState from "../../components/analytics/EmptyState";

import ErrorCard from "../../components/analytics/ErrorCard";

const InterviewAnalytics = () => {

    const {

        loading,

        interviewAnalytics,

        getInterviews,

    } = useAdminAnalytics();

    useEffect(() => {

        getInterviews();

    }, []);

    const columns = [

        {
            label: "Metric",
            key: "metric",
        },

        {
            label: "Value",
            key: "value",
        },

    ];

    const tableData = interviewAnalytics
        ? [

              {
                  metric: "Total Interviews",
                  value:
                      interviewAnalytics.totalInterviews,
              },

              {
                  metric: "Completed",
                  value:
                      interviewAnalytics.completed,
              },

              {
                  metric: "Pending",
                  value:
                      interviewAnalytics.pending,
              },

              {
                  metric: "Cancelled",
                  value:
                      interviewAnalytics.cancelled,
              },

              {
                  metric: "Average Score",
                  value:
                      interviewAnalytics.averageScore,
              },

              {
                  metric: "Completion Rate",
                  value:
                      interviewAnalytics.completionRate +
                      "%",
              },

          ]
        : [];
            if (loading) {

        return <LoadingSkeleton />;

    }

    if (!interviewAnalytics) {

        return (
            <ErrorCard
                title="Interview Analytics"
                message="Unable to load interview analytics."
            />
        );

    }
        return (

        <div className="p-6 space-y-6">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Interview Analytics
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Interview performance overview and statistics
                    </p>

                </div>

            </div>


            {/* Summary Card */}

            <InterviewAnalyticsCard
                analytics={interviewAnalytics}
            />


            {/* Progress Section */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-6">
                    Performance Overview
                </h2>

                <div className="space-y-6">

                    <ProgressBar
                        label="Completion Rate"
                        value={
                            interviewAnalytics.completionRate
                        }
                        color="bg-green-500"
                    />

                    <ProgressBar
                        label="Average Score"
                        value={
                            interviewAnalytics.averageScore
                        }
                        color="bg-blue-500"
                    />

                </div>

            </div>


            {/* Statistics Table */}

            <AnalyticsTable
                title="Interview Statistics"
                columns={columns}
                data={tableData}
            />

        </div>

    );

};

export default InterviewAnalytics;