import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getInterview, submitInterview } from "../../services/InterviewService";
import axios from "axios";
import toast from "react-hot-toast";

import MCQRound from "../../components/interview/MCQRound";
import CodingRound from "../../components/interview/CodingRound";
import VoiceRound from "../../components/interview/VoiceRound";

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [round1Result, setRound1Result] = useState(null);
  const [round2Result, setRound2Result] = useState(null);

  useEffect(() => {
    loadInterview();
  }, []);

  const loadInterview = async () => {
    try {
      const data = await getInterview(id);
      setInterview(data.interview);
      setQuestions(data.interview.questions || []);

      // If completed, redirect to feedback, but ONLY if we aren't showing the round results
      if (data.interview.status === "Completed" && !round1Result && !round2Result) {
        navigate(`/interviews/feedback/${id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMCQSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await submitInterview(id, questions);
      setRound1Result({
        score: res.interview?.mcqScore || 0,
        passed: res.interview?.status !== "Completed"
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit Round 1");
    } finally {
      setSubmitting(false);
    }
  };

  const proceedToRound2 = async () => {
    setRound1Result(null);
    setLoading(true);
    await loadInterview();
  };

  const handleCodingSubmit = async (codingResults) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token"); // Assuming auth uses token
      const res = await axios.post(
        `http://localhost:3000/api/interviews/submit-coding/${id}`,
        { codingQuestions: codingResults },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRound2Result({
        score: res.data.interview?.codingScore || 0,
        passed: res.data.interview?.status !== "Completed"
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit Round 2");
    } finally {
      setSubmitting(false);
    }
  };

  const proceedToRound3 = async () => {
    setRound2Result(null);
    setLoading(true);
    await loadInterview();
  };

  const handleVoiceSubmit = async (transcript) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/interviews/submit-voice/${id}`,
        { transcript },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Interview Completed!");
      navigate(`/interviews/feedback/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit Voice Round");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !interview) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center min-h-screen text-xl text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            Loading Interview Data...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      {round1Result ? (
        <div className="flex justify-center items-center min-h-screen text-white px-4">
          <div className="bg-slate-800/80 p-8 md:p-12 rounded-2xl max-w-2xl w-full text-center shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-4">
              {round1Result.passed ? "Round 1 Passed! 🎉" : "Round 1 Failed 😞"}
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              You scored <span className={`font-bold ${round1Result.passed ? 'text-green-400' : 'text-red-400'}`}>{round1Result.score}%</span> on the technical questions.
              <br/>
              {round1Result.passed 
                ? "Great job! You have cleared the 50% threshold." 
                : "Unfortunately, you did not meet the 50% threshold required to proceed."}
            </p>

            <div className="flex justify-center gap-4">
              {round1Result.passed ? (
                <button
                  onClick={proceedToRound2}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
                >
                  Move to Next Round
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      ) : round2Result ? (
        <div className="flex justify-center items-center min-h-screen text-white px-4">
          <div className="bg-slate-800/80 p-8 md:p-12 rounded-2xl max-w-2xl w-full text-center shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-4">
              {round2Result.passed ? "Round 2 Passed! 🎉" : "Round 2 Failed 😞"}
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              You scored <span className={`font-bold ${round2Result.passed ? 'text-green-400' : 'text-red-400'}`}>{round2Result.score}%</span> on the coding challenges.
              <br/>
              {round2Result.passed 
                ? "Great job! You successfully completed at least one coding question." 
                : "Unfortunately, you did not fully complete any coding question to proceed."}
            </p>

            <div className="flex justify-center gap-4">
              {round2Result.passed ? (
                <button
                  onClick={proceedToRound3}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
                >
                  Move to Next Round
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {interview.currentRound === 1 && (
            <MCQRound
              interview={interview}
              questions={questions}
              setQuestions={setQuestions}
              onSubmit={handleMCQSubmit}
              submitting={submitting}
            />
          )}

          {interview.currentRound === 2 && (
            <CodingRound
              interview={interview}
              codingQuestions={interview.codingQuestions}
              onSubmit={handleCodingSubmit}
              submitting={submitting}
            />
          )}

          {interview.currentRound === 3 && (
            <VoiceRound
              interview={interview}
              onSubmit={handleVoiceSubmit}
              submitting={submitting}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default InterviewDetails;