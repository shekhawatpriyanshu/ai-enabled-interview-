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
      <MainLayout showNavbar={false}>
        <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white px-4 overflow-hidden">
          <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute text-2xl">⚡</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-1">
                Loading Interview Session
              </h3>
              <p className="text-slate-400 text-sm">Synchronizing questions and AI state...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      {round1Result ? (
        <div className="relative min-h-screen bg-slate-950 flex justify-center items-center text-white px-4 overflow-hidden">
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none animate-pulse ${
            round1Result.passed ? "bg-emerald-500/20" : "bg-rose-500/20"
          }`}></div>

          <div className="relative z-10 backdrop-blur-2xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 rounded-3xl max-w-xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="text-6xl mb-4 animate-bounce">
              {round1Result.passed ? "🎉" : "😞"}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              {round1Result.passed ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                  Round 1 Passed!
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                  Round 1 Failed
                </span>
              )}
            </h2>

            <div className="inline-flex items-center gap-2 my-4 px-5 py-2 rounded-full bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Score</span>
              <span className={`text-2xl font-black ${round1Result.passed ? "text-emerald-400" : "text-rose-400"}`}>
                {round1Result.score}%
              </span>
            </div>

            <p className="text-slate-300 text-base mb-8 leading-relaxed max-w-md mx-auto">
              {round1Result.passed
                ? "Excellent performance! You solved enough questions correctly to qualify for the next round."
                : "Unfortunately, you did not reach the 50% threshold required to proceed. Keep practicing!"}
            </p>

            <div className="flex justify-center gap-4">
              {round1Result.passed ? (
                <button
                  onClick={proceedToRound2}
                  className="group relative overflow-hidden px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <span>Proceed to Coding Round</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      ) : round2Result ? (
        <div className="relative min-h-screen bg-slate-950 flex justify-center items-center text-white px-4 overflow-hidden">
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none animate-pulse ${
            round2Result.passed ? "bg-purple-500/20" : "bg-rose-500/20"
          }`}></div>

          <div className="relative z-10 backdrop-blur-2xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 rounded-3xl max-w-xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="text-6xl mb-4 animate-bounce">
              {round2Result.passed ? "🏆" : "😞"}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              {round2Result.passed ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                  Round 2 Passed!
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                  Round 2 Failed
                </span>
              )}
            </h2>

            <div className="inline-flex items-center gap-2 my-4 px-5 py-2 rounded-full bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Coding Score</span>
              <span className={`text-2xl font-black ${round2Result.passed ? "text-purple-400" : "text-rose-400"}`}>
                {round2Result.score}%
              </span>
            </div>

            <p className="text-slate-300 text-base mb-8 leading-relaxed max-w-md mx-auto">
              {round2Result.passed
                ? "Great job coding! You have successfully cleared the technical coding assessment."
                : "You did not achieve the minimum required score to pass the coding round."}
            </p>

            <div className="flex justify-center gap-4">
              {round2Result.passed ? (
                <button
                  onClick={proceedToRound3}
                  className="group relative overflow-hidden px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <span>Proceed to Voice AI Round</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
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