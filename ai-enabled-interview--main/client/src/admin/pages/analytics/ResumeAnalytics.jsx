import { useEffect } from "react";

import useAdminAnalytics from "../../hooks/useAdminAnalytics";

import ResumeAnalyticsCard from "../../components/analytics/ResumeAnalyticsCard";

import AnalyticsTable from "../../components/analytics/AnalyticsTable";

import ProgressBar from "../../components/analytics/ProgressBar";

import LoadingSkeleton from "../../components/analytics/LoadingSkeleton";

import ErrorCard from "../../components/analytics/ErrorCard";

import EmptyState from "../../components/analytics/EmptyState";

const ResumeAnalytics = () => {

    const {

        loading,

        resumeAnalytics,

        getResume,

    } = useAdminAnalytics();

    useEffect(() => {

        getResume();

    }, []);

    if (loading) {

        return <LoadingSkeleton />;

    }

    if (!resumeAnalytics) {

        return (

            <ErrorCard

                title="Resume Analytics"

                message="Unable to load resume analytics."

            />

        );

    }

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

    const tableData = [

        {

            metric: "Total Uploads",

            value: resumeAnalytics.totalUploads,

        },

        {

            metric: "Average ATS",

            value: resumeAnalytics.averageATS,

        },

        {

            metric: "Excellent",

            value: resumeAnalytics.excellent,

        },

        {

            metric: "Good",

            value: resumeAnalytics.good,

        },

        {

            metric: "Average",

            value: resumeAnalytics.average,

        },

        {

            metric: "Poor",

            value: resumeAnalytics.poor,

        },

    ];
        if (tableData.length === 0) {
        return (
            <EmptyState
                title="No Resume Analytics"
                message="No resume analytics data available."
            />
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Resume Analytics
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Resume upload statistics and ATS performance overview.
                    </p>

                </div>

            </div>

            {/* Analytics Cards */}

            <ResumeAnalyticsCard
                analytics={resumeAnalytics}
            />

            {/* ATS Progress */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-6">
                    ATS Score Distribution
                </h2>

                <div className="space-y-5">

                    <ProgressBar
                        label="Average ATS Score"
                        value={resumeAnalytics.averageATS}
                        color="bg-blue-600"
                    />

                    <ProgressBar
                        label="Excellent Resumes"
                        value={
                            resumeAnalytics.totalUploads > 0
                                ? Number(
                                      (
                                          (resumeAnalytics.excellent /
                                              resumeAnalytics.totalUploads) *
                                          100
                                      ).toFixed(2)
                                  )
                                : 0
                        }
                        color="bg-green-600"
                    />

                    <ProgressBar
                        label="Good Resumes"
                        value={
                            resumeAnalytics.totalUploads > 0
                                ? Number(
                                      (
                                          (resumeAnalytics.good /
                                              resumeAnalytics.totalUploads) *
                                          100
                                      ).toFixed(2)
                                  )
                                : 0
                        }
                        color="bg-indigo-600"
                    />

                    <ProgressBar
                        label="Average Resumes"
                        value={
                            resumeAnalytics.totalUploads > 0
                                ? Number(
                                      (
                                          (resumeAnalytics.average /
                                              resumeAnalytics.totalUploads) *
                                          100
                                      ).toFixed(2)
                                  )
                                : 0
                        }
                        color="bg-yellow-500"
                    />

                    <ProgressBar
                        label="Poor Resumes"
                        value={
                            resumeAnalytics.totalUploads > 0
                                ? Number(
                                      (
                                          (resumeAnalytics.poor /
                                              resumeAnalytics.totalUploads) *
                                          100
                                      ).toFixed(2)
                                  )
                                : 0
                        }
                        color="bg-red-600"
                    />

                </div>

            </div>

            {/* Statistics Table */}

            <AnalyticsTable
                title="Resume Statistics"
                columns={columns}
                data={tableData}
            />

        </div>
    );
};

export default ResumeAnalytics;