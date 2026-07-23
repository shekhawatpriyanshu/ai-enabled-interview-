import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getFeedback,
} from "../../services/InterviewService";

import ScoreCard from "../../components/interview/ScoreCard";
import FeedbackCard from "../../components/interview/FeedbackCard";

const FeedbackScreen = () => {
  const { id } = useParams();

  const [feedback, setFeedback] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback =
    async () => {
      try {
        const data =
          await getFeedback(id);

        setFeedback(
          data.feedback
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">
          Loading Feedback...
        </h1>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-400">
          Feedback Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">

          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-5xl mb-6 shadow-lg">
            🤖
          </div>

          <h1 className="text-5xl font-bold text-white mb-3">
            Interview Feedback
          </h1>

          <p className="text-slate-400 text-lg">
            AI Generated Evaluation Report
          </p>

        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <ScoreCard
            label="Overall Score"
            value={feedback.score}
          />

          <ScoreCard
            label="Communication"
            value={feedback.communication}
          />

          <ScoreCard
            label="Technical"
            value={
              feedback.technicalKnowledge
            }
          />

          <ScoreCard
            label="Problem Solving"
            value={
              feedback.problemSolving
            }
          />

        </div>

        {/* Feedback Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          <FeedbackCard
            title="💪 Strengths"
            items={
              feedback.strengths
            }
          />

          <FeedbackCard
            title="⚠️ Weaknesses"
            items={
              feedback.weaknesses
            }
          />

          <FeedbackCard
            title="🚀 Suggestions"
            items={
              feedback.suggestions
            }
          />

        </div>

      </div>

    </div>
  );
};

export default FeedbackScreen;