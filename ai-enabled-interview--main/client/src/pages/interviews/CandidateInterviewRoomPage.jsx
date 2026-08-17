import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import { useAuth } from "../../context/AuthContext";
import { getLiveInterviewRoomById, runCodeInRoom } from "../../services/liveInterviewService";
import {
  FaUserTie,
  FaClock,
  FaPaperPlane,
  FaCode,
  FaCheckCircle,
  FaSpinner,
  FaTrophy,
  FaMagic,
  FaPlay,
  FaTerminal,
  FaChevronRight,
  FaBell,
  FaCommentAlt,
} from "react-icons/fa";

export default function CandidateInterviewRoomPage() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "ROOM_8F32K";
  const navigate = useNavigate();
  const { user } = useAuth();
  const candidateName = user?.name || "Priyanshu";

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewerStatus, setInterviewerStatus] = useState("Offline");
  const [interviewState, setInterviewState] = useState("waiting"); // 'waiting' | 'active' | 'completed'

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionId, setQuestionId] = useState("q1");
  const [questionType, setQuestionType] = useState("Technical");
  const [questionOrder, setQuestionOrder] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);

  const [answerInput, setAnswerInput] = useState("");
  const [code, setCode] = useState(`function answer() {\n  // Write solution here\n  return true;\n}\n`);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'text' | 'code'

  const [timerRemaining, setTimerRemaining] = useState(1800);
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [questionToast, setQuestionToast] = useState(null);

  // Judge0 Code Execution
  const [executing, setExecuting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setInterviewState(res.room.status || "waiting");
          setTimerRemaining(res.room.timerRemaining || 1800);
          setTotalQuestions(res.room.questions?.length || 1);

          if (res.room.questions && res.room.questions.length > 0) {
            const firstQ = res.room.questions[0];
            setCurrentQuestion(firstQ.question);
            setQuestionId(firstQ.questionId);
            setQuestionType(firstQ.type || "Technical");
            if (firstQ.initialCode) {
              setCode(firstQ.initialCode);
            }
          }
          if (res.room.finalResult) {
            setFinalResult(res.room.finalResult);
          }
        }
      } catch (err) {
        console.error("Load room error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [roomId]);

  useEffect(() => {
    socket.emit("join_room", { roomId, role: "Candidate", userName: candidateName, userEmail: user?.email });

    socket.on("candidate_joined", (data) => {
      if (data.hasAdmin) {
        setInterviewerStatus("Connected");
      }
    });

    socket.on("interview_started", () => {
      setInterviewState("active");
    });

    socket.on("new_question", (data) => {
      setInterviewState("active");
      setCurrentQuestion(data.question);
      if (data.questionId) setQuestionId(data.questionId);
      if (data.type) setQuestionType(data.type);
      if (data.order) setQuestionOrder(data.order);
      if (data.initialCode) {
        setCode(data.initialCode);
      }
      setSubmittedCurrent(false);
      setAnswerInput("");
      setOutputResult(null);

      // Notification toast
      setQuestionToast(`💡 New Question Pushed: Q${data.order || 1}`);
      setTimeout(() => setQuestionToast(null), 4000);
    });

    socket.on("timer_tick", ({ timerRemaining: newTime }) => {
      setTimerRemaining(newTime);
    });

    socket.on("interview_ended", ({ room: r, finalResult: fr }) => {
      setInterviewState("completed");
      if (r) setRoom(r);
      if (fr) setFinalResult(fr);
    });

    socket.on("final_result", ({ finalResult: fr }) => {
      setInterviewState("completed");
      setFinalResult(fr);
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("interview_started");
      socket.off("new_question");
      socket.off("timer_tick");
      socket.off("interview_ended");
      socket.off("final_result");
    };
  }, [roomId, candidateName, user?.email]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Debounced Answer Typing Sync
  const handleAnswerTyping = (e) => {
    const val = e.target.value;
    setAnswerInput(val);
    setSubmittedCurrent(false);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      socket.emit("answer_typing", { roomId, questionId, textAnswer: val });
    }, 400);
  };

  // Live Judge0 Code Execution
  const handleRunCode = async () => {
    setExecuting(true);
    try {
      const res = await runCodeInRoom(roomId, { code, language: "javascript" });
      if (res.success) {
        setOutputResult(res.result);
      } else {
        setOutputResult({ error: res.message || "Execution error" });
      }
    } catch (err) {
      console.error("Code run error:", err);
      setOutputResult({ error: err.message || "Execution error" });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answerInput.trim() && !code.trim()) return;

    socket.emit("submit_answer", {
      roomId,
      questionId,
      questionText: currentQuestion || "Question",
      answer: answerInput.trim(),
      code,
    });
    setSubmittedCurrent(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040711] text-sky-400 flex flex-col items-center justify-center font-sans">
        <FaSpinner className="text-4xl animate-spin mb-3 text-sky-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Joining Live Interview Room {roomId}...</p>
      </div>
    );
  }

  // 12. CANDIDATE FINAL SCREEN (COMPLETED REPORT)
  if (interviewState === "completed" || room?.status === "completed") {
    const result = finalResult || room?.finalResult || {
      overallScore: 81,
      technicalKnowledge: 82,
      problemSolving: 78,
      communication: 85,
      recommendation: "Strong Candidate",
      feedbackSummary: "You demonstrated strong technical fundamentals, good response clarity, and clean code logic.",
      strengths: ["Clear technical reasoning", "Proactive live code answer submission"],
      improvements: ["Include more edge case handling in caching algorithms"],
      questionFeedback: [],
    };

    const qFeedbackList = result.questionFeedback && result.questionFeedback.length > 0
      ? result.questionFeedback
      : (room?.responses || []).map((r, i) => ({
          questionId: r.questionId || `q${i + 1}`,
          questionText: r.questionText || `Question ${i + 1}`,
          submittedAnswer: r.answer || "No written answer provided.",
          submittedCode: r.code || "",
          score: 82,
          status: "Passed",
          feedback: "Solid technical explanation provided during live room session.",
        }));

    return (
      <div className="min-h-screen bg-[#040711] text-slate-100 p-4 md:p-8 font-sans selection:bg-sky-500 selection:text-white animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#0a0e1a]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 md:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-emerald-500/25">
              <FaTrophy />
            </div>

            <div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20 font-extrabold uppercase tracking-wider">
                Interview Completed 🎉
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">Your Final Performance Report</h1>
              <div className="text-5xl font-black text-emerald-400 mt-2 tracking-tight">{result.overallScore}%</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-sky-500/40 transition-all">
                <span className="text-slate-400 block mb-1 font-semibold">Technical Knowledge</span>
                <span className="text-2xl font-black text-sky-400">{result.technicalKnowledge}%</span>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-purple-500/40 transition-all">
                <span className="text-slate-400 block mb-1 font-semibold">Problem Solving</span>
                <span className="text-2xl font-black text-purple-400">{result.problemSolving}%</span>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all">
                <span className="text-slate-400 block mb-1 font-semibold">Communication</span>
                <span className="text-2xl font-black text-indigo-400">{result.communication}%</span>
              </div>
            </div>

            {/* OVERALL AI FEEDBACK SUMMARY */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800/90 text-left space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-[11px]">AI Performance Evaluation</h4>
              <p className="text-slate-300 leading-relaxed font-normal">{result.feedbackSummary}</p>
            </div>

            {/* SUBMITTED QUESTIONS FEEDBACK BREAKDOWN */}
            <div className="text-left space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                Submitted Questions AI Breakdown ({qFeedbackList.length})
              </h3>

              <div className="space-y-4">
                {qFeedbackList.map((q, idx) => (
                  <div key={idx} className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white leading-snug">
                        Question {idx + 1}: {q.questionText}
                      </span>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            q.status === "Passed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : q.status === "Partial Credit"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {q.status || "Passed"}
                        </span>
                        <span className="text-xs font-mono font-black text-sky-400">
                          {q.score}%
                        </span>
                      </div>
                    </div>

                    {/* CANDIDATE'S SUBMITTED WRITTEN ANSWER & CODE */}
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Your Submitted Answer:</span>
                        <p className="text-slate-200 font-sans leading-relaxed">{q.submittedAnswer}</p>
                      </div>
                      {q.submittedCode && (
                        <div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold block mb-1">Your Submitted Code:</span>
                          <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 overflow-x-auto">
                            {q.submittedCode}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* AI FEEDBACK FOR THIS QUESTION */}
                    <div className="bg-sky-950/20 border border-sky-500/20 p-3.5 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold text-sky-400 uppercase block">AI Question Feedback:</span>
                      <p className="text-slate-300 leading-relaxed font-normal">{q.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. WAITING STATE SCREEN (CANDIDATE VIEW)
  if (interviewState === "waiting" || room?.status === "waiting") {
    return (
      <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col items-center justify-center p-6 font-sans selection:bg-sky-500 selection:text-white">
        <div className="bg-[#0a0e1a]/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 md:p-10 max-w-lg w-full text-center shadow-2xl space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-sky-500/30 animate-pulse">
            <FaUserTie />
          </div>

          <div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3.5 py-1 rounded-full border border-sky-500/20 font-bold">
              Room ID: {roomId}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-4 tracking-tight">Waiting for Interviewer...</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed font-medium">
              Please stay on this page. Your interviewer will start the live technical session shortly.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 py-3 rounded-2xl border border-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Connected to Live Interview Room Channel</span>
          </div>
        </div>
      </div>
    );
  }

  // 5-8. ACTIVE CANDIDATE INTERVIEW ROOM SCREEN
  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* REAL-TIME QUESTION PUSHED TOAST NOTIFICATION */}
      {questionToast && (
        <div className="fixed top-20 right-6 z-[999] bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-400/40 font-bold text-xs flex items-center space-x-2 animate-bounce">
          <FaBell className="text-amber-300 animate-wiggle" />
          <span>{questionToast}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="h-16 border-b border-slate-800/90 bg-[#080c18]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <FaUserTie />
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-2 tracking-tight">
              LIVE INTERVIEW SESSION
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold border border-sky-500/30">
                {roomId}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              Interviewer: Admin
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${interviewerStatus === "Connected" ? "text-emerald-400" : "text-amber-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${interviewerStatus === "Connected" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                {interviewerStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
            <FaClock className="text-amber-400 animate-pulse text-xs" />
            <span className="font-mono text-sm font-black text-white">{formatTime(timerRemaining)}</span>
          </div>
        </div>
      </header>

      {/* MAIN INTERACTIVE QUESTION & ANSWER WORKSPACE */}
      <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full space-y-5 overflow-y-auto">
        {/* CURRENT QUESTION DISPLAY */}
        <div className="bg-[#0b0f1d]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
                <FaMagic /> Current Question
              </span>
              <span
                className={`text-[10px] font-black uppercase px-3 py-0.5 rounded-full ${
                  questionType === "Coding"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {questionType === "Coding" ? "💻 Live Coding Challenge" : "💡 Technical Question"}
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              Q{questionOrder} of {totalQuestions}
            </span>
          </div>

          <div className="bg-slate-950/80 p-5 md:p-6 rounded-2xl border border-slate-800/90 shadow-inner">
            <p className="text-base md:text-lg font-bold text-white leading-relaxed">
              {currentQuestion || "Explain the difference between JWT authentication and session authentication."}
            </p>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE TABS */}
        <div className="flex items-center justify-between bg-[#0b0f1d]/90 p-2 rounded-2xl border border-slate-800/90">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              Split View (Text & Code)
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === "text"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              📝 Text Response Only
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === "code"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              💻 Code Editor Only
            </button>
          </div>

          {submittedCurrent && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 mr-2">
              <FaCheckCircle /> Answer Submitted to Interviewer ✓
            </span>
          )}
        </div>

        {/* WORKSPACE AREA */}
        <form onSubmit={handleSubmitAnswer} className="space-y-5">
          {/* WRITTEN EXPLANATION RESPONSE */}
          {(activeTab === "all" || activeTab === "text") && (
            <div className="bg-[#0b0f1d]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <FaCommentAlt /> Your Written Technical Explanation
                </label>
                <span className="text-[10px] text-slate-500 font-semibold">Live synced as you type</span>
              </div>

              <textarea
                value={answerInput}
                onChange={handleAnswerTyping}
                rows={4}
                placeholder="Type your structured technical response or explanation here..."
                className="w-full bg-slate-950/80 text-slate-100 text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 font-sans leading-relaxed transition-all"
              />
            </div>
          )}

          {/* MONACO CODE EDITOR & LIVE RUNNER */}
          {(activeTab === "all" || activeTab === "code") && (
            <div className="bg-[#0b0f1d]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                  <FaCode /> Live Code Editor (JavaScript)
                </label>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={executing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <FaPlay className="text-[10px]" />
                  <span>{executing ? "Executing..." : "Run Code (Judge0)"}</span>
                </button>
              </div>

              <div className="h-64 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val)}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* JUDGE0 EXECUTION OUTPUT CONSOLE */}
              {outputResult && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl font-mono text-xs space-y-1 shadow-inner">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <FaTerminal /> Execution Output
                    </span>
                    <button type="button" onClick={() => setOutputResult(null)} className="text-[10px] hover:text-white">
                      Clear Console
                    </button>
                  </div>
                  {outputResult.output && <pre className="text-emerald-400 whitespace-pre-wrap">{outputResult.output}</pre>}
                  {outputResult.error && <pre className="text-rose-400 whitespace-pre-wrap">{outputResult.error}</pre>}
                </div>
              )}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-9 py-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/20"
            >
              Submit Response to Interviewer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
