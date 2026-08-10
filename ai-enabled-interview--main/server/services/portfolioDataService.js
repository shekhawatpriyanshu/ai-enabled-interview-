const CodeSubmission = require("../models/codeSubmission");
const InterviewSession = require("../models/interviewSession");
const UserReward = require("../models/userReward");
const Profile = require("../models/profile");

const getCodingStats = async (userId) => {
    try {
        const submissions = await CodeSubmission.find({
            user: userId,
        });

        const accepted = submissions.filter(
            (submission) => submission.status === "Accepted"
        );

        return {
            totalSubmissions: submissions.length,
            acceptedSubmissions: accepted.length,
            accuracyRate: submissions.length > 0 ? Math.round((accepted.length / submissions.length) * 100) : 0
        };
    } catch (e) {
        return { totalSubmissions: 0, acceptedSubmissions: 0, accuracyRate: 0 };
    }
};

const getInterviewStats = async (userId) => {
    try {
        const interviews = await InterviewSession.find({
            user: userId,
        });

        const completed = interviews.filter(
            (interview) => interview.status?.toLowerCase() === "completed"
        );

        const scores = completed
            .map((interview) => Number(interview.overallScore ?? interview.mcqScore ?? interview.score))
            .filter((score) => !Number.isNaN(score) && score >= 0);

        const averageScore =
            scores.length > 0
                ? Math.round(
                    scores.reduce((sum, score) => sum + score, 0) /
                    scores.length
                )
                : 0;

        return {
            totalInterviews: completed.length,
            averageScore,
            bestScore: scores.length
                ? Math.max(...scores)
                : 0,
        };
    } catch (e) {
        return { totalInterviews: 0, averageScore: 0, bestScore: 0 };
    }
};

const getUserBadges = async (userId) => {
    try {
        const rewards = await UserReward.find({ user: userId }).populate("reward");
        return rewards.map((r) => r.reward?.title || r.reward?.name).filter(Boolean);
    } catch (e) {
        return [];
    }
};

const getPortfolioStats = async (userId) => {
    try {
        const [codingStats, interviewStats, badges, profile] = await Promise.all([
            getCodingStats(userId),
            getInterviewStats(userId),
            getUserBadges(userId),
            Profile.findOne({ user: userId }).lean().catch(() => null),
        ]);

        return {
            codingStats,
            interviewStats,
            badges,
            avatar: profile?.avatar || null,
            headline: profile?.headline || profile?.title || "",
        };
    } catch (e) {
        return {
            codingStats: { totalSubmissions: 0, acceptedSubmissions: 0, accuracyRate: 0 },
            interviewStats: { totalInterviews: 0, averageScore: 0, bestScore: 0 },
            badges: [],
            avatar: null,
            headline: "",
        };
    }
};


module.exports = {
    getPortfolioStats,
    getCodingStats,
    getInterviewStats,
};

