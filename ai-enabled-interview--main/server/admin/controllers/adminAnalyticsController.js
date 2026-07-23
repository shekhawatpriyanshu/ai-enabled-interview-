const User = require("../../models/user");

const InterviewSession = require("../../models/interviewSession");

const Submission = require("../../models/submission");

const CodeSubmission = require("../../models/codeSubmission");

const CodingProblem = require("../../models/codingProblem");

const Contest = require("../../models/contest");

const ContestSubmission = require("../../models/contestSubmission");

const Discussion = require("../../models/discussion");

const Comment = require("../../models/comment");

const Resume = require("../../models/resume");
const ResumeAnalysis = require("../../models/resumeAnalysis");


const InterviewFeedback = require("../../models/interviewFeedback");




/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

const getDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments({ role: "user" });

        const activeUsers = await User.countDocuments({
            role: "user",
            isBlocked: false,
        });

        const blockedUsers = await User.countDocuments({
            role: "user",
            isBlocked: true,
        });

        const totalInterviews =
            await InterviewSession.countDocuments();

        const completedInterviews =
            await InterviewSession.countDocuments({
                status: "Completed",
            });

        const totalTests =
            await Submission.countDocuments();

        const totalCodingProblems =
            await CodingProblem.countDocuments();

        const codingSubmissions =
            await CodeSubmission.countDocuments();

        const acceptedCoding =
            await CodeSubmission.countDocuments({
                status: "Accepted",
            });

        const totalContests =
            await Contest.countDocuments();

        const contestParticipants =
            await ContestSubmission.countDocuments();

        const totalDiscussions =
            await Discussion.countDocuments();

        const totalComments =
            await Comment.countDocuments();

        const totalResumeUploads =
            await Resume.countDocuments();

        res.status(200).json({
            success: true,

            dashboard: {

                users: {
                    totalUsers,
                    activeUsers,
                    blockedUsers,
                },

                interviews: {
                    totalInterviews,
                    completedInterviews,
                },

                tests: {
                    totalTests,
                },

                coding: {
                    totalCodingProblems,
                    codingSubmissions,
                    acceptedCoding,
                },

                contests: {
                    totalContests,
                    contestParticipants,
                },

                community: {
                    totalDiscussions,
                    totalComments,
                },

                resumes: {
                    totalResumeUploads,
                },
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



/*
|--------------------------------------------------------------------------
| USER ANALYTICS
|--------------------------------------------------------------------------
*/

const getUserAnalytics = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments({ role: "user" });

        const activeUsers =
            await User.countDocuments({
                role: "user",
                isBlocked: false,
            });

        const blockedUsers =
            await User.countDocuments({
                role: "user",
                isBlocked: true,
            });

        const verifiedUsers =
            await User.countDocuments({
                role: "user",
                isVerified: true,
            });

        const unverifiedUsers =
            await User.countDocuments({
                role: "user",
                isVerified: { $ne: true },
            });

        const today = new Date();

        const last7Days = new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        const newUsers =
            await User.countDocuments({
                role: "user",
                createdAt: {
                    $gte: last7Days,
                },
            });

        res.status(200).json({
            success: true,

            analytics: {

                totalUsers,

                activeUsers,

                blockedUsers,

                verifiedUsers,

                unverifiedUsers,

                newUsers,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
const getInterviewAnalytics = async (req, res) => {
    try {
        const totalInterviews =
            await InterviewSession.countDocuments();

        const completed =
            await InterviewSession.countDocuments({
                status: "Completed",
            });

        const pending =
            await InterviewSession.countDocuments({
                status: "Started",
            });

        const cancelled =
            await InterviewSession.countDocuments({
                status: "Cancelled",
            });

        const interviews =
            await InterviewSession.find({
                status: "Completed",
            });

        const interviewIds = interviews.map((i) => i._id);
        const feedbacks = await InterviewFeedback.find({
            interview: { $in: interviewIds },
        });

        let totalScore = 0;

        feedbacks.forEach((item) => {
            totalScore += item.score || 0;
        });

        const averageScore =
            feedbacks.length > 0
                ? Number(
                    (
                        totalScore /
                        feedbacks.length
                    ).toFixed(2)
                )
                : 0;

        const completionRate =
            totalInterviews > 0
                ? Number(
                    (
                        (completed /
                            totalInterviews) *
                        100
                    ).toFixed(2)
                )
                : 0;

        res.status(200).json({
            success: true,

            analytics: {
                totalInterviews,

                completed,

                pending,

                cancelled,

                completionRate,

                averageScore,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getCodingAnalytics =
    async (req, res) => {
        try {
            const totalProblems =
                await CodingProblem.countDocuments();

            const totalSubmissions =
                await CodeSubmission.countDocuments();

            const accepted =
                await CodeSubmission.countDocuments({
                    status: "Accepted",
                });

            const wrongAnswer =
                await CodeSubmission.countDocuments({
                    status: "Wrong Answer",
                });

            const runtimeError =
                await CodeSubmission.countDocuments({
                    status: "Runtime Error",
                });

            const compileError =
                await CodeSubmission.countDocuments({
                    status: "Compilation Error",
                });

            const acceptanceRate =
                totalSubmissions > 0
                    ? Number(
                        (
                            (accepted /
                                totalSubmissions) *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            res.status(200).json({
                success: true,

                analytics: {
                    totalProblems,

                    totalSubmissions,

                    accepted,

                    wrongAnswer,

                    runtimeError,

                    compileError,

                    acceptanceRate,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };
const getResumeAnalytics = async (req, res) => {
    try {
        const totalUploads = await Resume.countDocuments();
        const analyses = await ResumeAnalysis.find();

        let totalATS = 0;
        analyses.forEach((analysis) => {
            totalATS += analysis.atsScore || 0;
        });

        const averageATS =
            analyses.length > 0
                ? Number((totalATS / analyses.length).toFixed(2))
                : 0;

        const excellent = analyses.filter((r) => r.atsScore >= 85).length;
        const good = analyses.filter((r) => r.atsScore >= 70 && r.atsScore < 85).length;
        const average = analyses.filter((r) => r.atsScore >= 35 && r.atsScore < 70).length;
        const poor = analyses.filter((r) => r.atsScore < 35).length;

        res.status(200).json({
            success: true,
            analytics: {
                totalUploads,
                averageATS,
                excellent,
                good,
                average,
                poor,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {

    getDashboard,

    getUserAnalytics,

    getInterviewAnalytics,

    getCodingAnalytics,

    getResumeAnalytics,

};