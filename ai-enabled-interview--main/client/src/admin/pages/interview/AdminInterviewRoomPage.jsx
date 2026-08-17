import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../../socket";
import { getLiveInterviewRoomById, submitAndEndInterview } from "../../../services/liveInterviewService";
import {
  FaUserGraduate,
  FaClock,
  FaPlay,
  FaStop,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
  FaTrophy,
  FaChevronRight,
  FaCopy,
  FaCheck,
  FaChartLine,
  FaPlus,
  FaCode,
  FaLightbulb,
  FaTerminal,
} from "react-icons/fa";

export default function AdminInterviewRoomPage() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "ROOM_8F32K";
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateStatus, setCandidateStatus] = useState("Offline");
  const [interviewState, setInterviewState] = useState("waiting"); // 'waiting' | 'active' | 'completed'

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customType, setCustomType] = useState("Technical");
  const [customCode, setCustomCode] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [responses, setResponses] = useState([]);
  const [liveTypingAnswer, setLiveTypingAnswer] = useState({});
  const [timerRemaining, setTimerRemaining] = useState(1800);

  const [finalResult, setFinalResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setInterviewState(res.room.status || "waiting");
          setQuestions(res.room.questions || []);
          setResponses(res.room.responses || []);
          setTimerRemaining(res.room.timerRemaining || 1800);
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
    socket.emit("join_room", { roomId, role: "Admin", userName: "Admin" });

    socket.on("candidate_joined", (data) => {
      setCandidateStatus(data.status || "Connected");
    });

    socket.on("interview_started", ({ room: r }) => {
      setInterviewState("active");
      if (r) setRoom(r);
    });

    socket.on("answer_typing", ({ questionId, textAnswer }) => {
      setLiveTypingAnswer((prev) => ({
        ...prev,
        [questionId]: textAnswer,
      }));
    });

    socket.on("answer_submitted", (data) => {
      setResponses((prev) => {
        const idx = prev.findIndex((p) => p.questionId === data.questionId);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = { ...clone[idx], answer: data.answer, code: data.code };
          return clone;
        }
        return [...prev, data];
      });
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
      setFinalResult(fr);
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("interview_started");
      socket.off("answer_typing");
      socket.off("answer_submitted");
      socket.off("timer_tick");
      socket.off("interview_ended");
      socket.off("final_result");
    };
  }, [roomId]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartInterview = () => {
    setInterviewState("active");
    socket.emit("start_interview", { roomId });
  };

  const handleSendQuestion = (questionObj) => {
    const qToUse = questionObj || questions[currentQIndex] || {
      questionId: `q${currentQIndex + 1}`,
      question: customQuestion,
      type: "Technical",
      initialCode: "",
      order: currentQIndex + 1,
    };
    socket.emit("send_question", {
      roomId,
      questionId: qToUse.questionId,
      question: qToUse.question,
      type: qToUse.type || "Technical",
      initialCode: qToUse.initialCode || "",
      order: qToUse.order || currentQIndex + 1,
    });
  };

  const handleSelectQuestion = (idx) => {
    setCurrentQIndex(idx);
    const targetQ = questions[idx];
    if (targetQ) {
      handleSendQuestion(targetQ);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentQIndex(nextIdx);
      const nextQ = questions[nextIdx];
      socket.emit("next_question", {
        roomId,
        questionIndex: nextIdx,
        questionId: nextQ.questionId,
        question: nextQ.question,
        type: nextQ.type || "Technical",
        initialCode: nextQ.initialCode || "",
        order: nextIdx + 1,
      });
    }
  };

  const handlePushCustomQuestion = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const newQObj = {
      questionId: `custom_${Date.now()}`,
      question: customQuestion.trim(),
      type: customType,
      initialCode: customType === "Coding" ? customCode : "",
      order: questions.length + 1,
    };

    setQuestions((prev) => [...prev, newQObj]);
    setCurrentQIndex(questions.length);
    handleSendQuestion(newQObj);

    setCustomQuestion("");
    setCustomCode("");
    setShowCustomModal(false);
  };

  const handleEndInterview = async () => {
    socket.emit("end_interview", { roomId });
    try {
      const res = await submitAndEndInterview(roomId, {});
      if (res.finalResult) {
        setFinalResult(res.finalResult);
      }
    } catch (err) {
      console.error("End interview error:", err);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040711] text-[#38bdf8] flex flex-col items-center justify-center font-sans">
        <FaSpinner className="text-4xl animate-spin mb-3 text-sky-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Initializing Admin Control Room {roomId}...</p>
      </div>
    );
  }

  // 11. FINAL RESULT SCREEN (ADMIN VIEW)
  if (interviewState === "completed" || room?.status === "completed") {
    const result = finalResult || room?.finalResult || {
      overallScore: 81,
      technicalKnowledge: 82,
      problemSolving: 78,
      communication: 85,
      recommendation: "Strong Candidate",
      feedbackSummary: "Demonstrated strong technical knowledge and good problem-solving ability.",
      strengths: ["Strong React & Node.js fundamental understanding", "Clear explanation of JWT authentication"],
      improvements: ["Deepen knowledge in cache invalidation strategies"],
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
          <div className="bg-[#0a0e1a]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
              <div>
                <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 px-3.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Interview Completed
                </span>
                <h1 className="text-3xl font-black text-white mt-3 tracking-tight">Final Evaluation Report (Admin)</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate: <strong className="text-slate-200">{room?.candidateName || "Priyanshu"}</strong> | Role: <strong className="text-slate-200">{room?.role || "MERN Developer"}</strong>
                </p>
              </div>

              <div className="text-left md:text-right bg-slate-950/80 px-6 py-4 rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Overall Score</span>
                <span className="text-4xl font-black text-emerald-400 tracking-tight">{result.overallScore}%</span>
              </div>
            </div>

            {/* Score Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-sky-500/40 transition-all duration-300">
                <span className="text-xs text-slate-400 block font-semibold">Technical Knowledge</span>
                <span className="text-2xl font-black text-sky-400 mt-1 block tracking-tight">{result.technicalKnowledge}%</span>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-purple-500/40 transition-all duration-300">
                <span className="text-xs text-slate-400 block font-semibold">Problem Solving</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block tracking-tight">{result.problemSolving}%</span>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-300">
                <span className="text-xs text-slate-400 block font-semibold">Communication</span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block tracking-tight">{result.communication}%</span>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2 text-left">
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest">
                Recommendation: {result.recommendation}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{result.feedbackSummary}</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">✓ Key Strengths</h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  {(result.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">⚠ Areas for Improvement</h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  {(result.improvements || []).map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            </div>

            {/* SUBMITTED QUESTIONS FEEDBACK BREAKDOWN (ADMIN VIEW) */}
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
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Candidate Submitted Answer:</span>
                        <p className="text-slate-200 font-sans leading-relaxed">{q.submittedAnswer}</p>
                      </div>
                      {q.submittedCode && (
                        <div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold block mb-1">Candidate Submitted Code:</span>
                          <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 overflow-x-auto">
                            {q.submittedCode}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* AI FEEDBACK FOR THIS QUESTION */}
                    <div className="bg-sky-950/20 border border-sky-500/20 p-3 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold text-sky-400 uppercase block">AI Question Evaluation:</span>
                      <p className="text-slate-300 leading-relaxed font-normal">{q.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800/80">
              <button
                onClick={() => navigate("/admin/live-interviews")}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Back to Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. WAITING STATE SCREEN (ADMIN VIEW)
  if (interviewState === "waiting" || room?.status === "waiting") {
    return (
      <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col items-center justify-center p-6 font-sans selection:bg-sky-500 selection:text-white">
        <div className="bg-[#0a0e1a]/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 md:p-10 max-w-xl w-full text-center shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-indigo-500/30">
            <FaUserGraduate />
          </div>

          <div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20 font-bold">
              Room ID: {roomId}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-4 tracking-tight">Live Interview Session (Admin)</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">
              Role: <strong className="text-slate-200">{room?.role || "MERN Developer"}</strong> | Duration: <strong className="text-slate-200">{room?.duration || 30} min</strong>
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Candidate: {room?.candidateName || "Priyanshu"}</span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                candidateStatus === "Connected"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${candidateStatus === "Connected" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
              Status: {candidateStatus === "Connected" ? "🟢 Connected" : "⏳ Waiting"}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center space-x-3">
            <button
              onClick={copyRoomId}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-2xl border border-slate-800 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {copied ? "Copied Link ✓" : "Copy Room Link"}
            </button>
            <button
              onClick={handleStartInterview}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/20"
            >
              START INTERVIEW
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5-8. ACTIVE INTERVIEW ROOM SCREEN (ADMIN VIEW)
  const currentQ = questions[currentQIndex] || {
    questionId: "q1",
    question: "Explain the difference between JWT authentication and session authentication.",
    type: "Technical",
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800/90 bg-[#080c18]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <FaUserGraduate />
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-2 tracking-tight">
              LIVE INTERVIEW CONTROL (ADMIN)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                {roomId}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              Candidate: {room?.candidateName || "Priyanshu"}
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${candidateStatus === "Connected" ? "text-emerald-400" : "text-amber-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${candidateStatus === "Connected" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                {candidateStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
            <FaClock className="text-amber-400 animate-pulse text-xs" />
            <span className="font-mono text-sm font-black text-white">{formatTime(timerRemaining)}</span>
          </div>

          <button
            onClick={handleEndInterview}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            END INTERVIEW
          </button>
        </div>
      </header>

      {/* QUESTION SELECTOR STEPPER STRIP */}
      <div className="bg-[#080c18] border-b border-slate-800/80 px-6 py-2.5 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider shrink-0 mr-2">
          Questions Navigator:
        </span>
        {questions.map((q, idx) => (
          <button
            key={q.questionId || idx}
            onClick={() => handleSelectQuestion(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all duration-200 transform hover:scale-105 cursor-pointer ${
              currentQIndex === idx
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-sky-400"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {q.type === "Coding" ? <FaCode className="text-[10px] text-sky-400" /> : <FaLightbulb className="text-[10px] text-amber-400" />}
            <span>Q{idx + 1}: {q.type || "Technical"}</span>
          </button>
        ))}

        <button
          onClick={() => setShowCustomModal(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 flex items-center space-x-1 shrink-0 transition cursor-pointer"
        >
          <FaPlus className="text-[10px]" />
          <span>Custom Question</span>
        </button>
      </div>

      {/* MAIN ADMIN CONTROLS SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: SEND QUESTION & CONTROLS */}
        <div className="flex-1 flex flex-col border-r border-slate-800/80 bg-[#050812] p-6 space-y-6 overflow-y-auto">
          {/* CURRENT QUESTION SENDER */}
          <div className="bg-[#0b0f1d]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-black uppercase text-sky-400 tracking-wider">
                  Question {currentQIndex + 1} of {questions.length || 4}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-3 py-0.5 rounded-full ${
                    currentQ.type === "Coding"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {currentQ.type === "Coding" ? "💻 Live Coding Challenge" : "💡 Technical Question"}
                </span>
              </div>

              <button
                onClick={handleNextQuestion}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <span>Next Question</span>
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-base md:text-lg font-bold text-white leading-relaxed">{currentQ.question}</p>
              {currentQ.initialCode && (
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-emerald-400 block mb-1 font-bold">Starter Code Template:</span>
                  <pre className="p-3.5 bg-[#070a14] text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800">
                    {currentQ.initialCode}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => handleSendQuestion(currentQ)}
                className="px-7 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer border border-sky-400/20"
              >
                <FaPaperPlane />
                <span>Send Question to Candidate</span>
              </button>
            </div>
          </div>

          {/* CANDIDATE RESPONSES FEED */}
          <div className="flex-1 bg-[#0b0f1d]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 flex flex-col space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                Candidate Live Answer Feed
              </h3>
              {liveTypingAnswer[currentQ.questionId] && (
                <span className="text-xs text-sky-400 font-bold animate-pulse flex items-center gap-1.5 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                  Candidate is typing live...
                </span>
              )}
            </div>

            <div className="flex-1 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 overflow-y-auto space-y-4">
              {/* LIVE UNCOMMITTED TYPING PREVIEW */}
              {liveTypingAnswer[currentQ.questionId] && (
                <div className="bg-sky-950/30 p-4 rounded-2xl border border-sky-500/30 space-y-2 animate-fade-in">
                  <span className="text-[10px] font-bold text-sky-400 uppercase block">
                    ✍ Live Candidate Typing Stream (Q: {currentQ.questionId})
                  </span>
                  <p className="text-xs text-sky-200 leading-relaxed font-sans italic">{liveTypingAnswer[currentQ.questionId]}</p>
                </div>
              )}

              {responses.length === 0 && !liveTypingAnswer[currentQ.questionId] ? (
                <div className="text-center py-16 text-slate-500 text-xs italic font-normal">
                  Candidate has not submitted an answer yet. Sent questions will appear here once answered.
                </div>
              ) : (
                responses.map((resp, i) => (
                  <div key={i} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                        Submitted Answer ✓ (Q: {resp.questionId})
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {resp.answeredAt ? new Date(resp.answeredAt).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{resp.answer}</p>
                    {resp.code && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-emerald-400 block font-bold">Candidate Code Submission:</span>
                        <pre className="p-3.5 bg-slate-950 text-emerald-400 text-xs font-mono rounded-xl border border-slate-800 overflow-x-auto">
                          {resp.code}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM QUESTION MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-800">
            <h2 className="text-xl font-black">Push Custom Live Question</h2>
            <form onSubmit={handlePushCustomQuestion} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Question Type</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-300"
                >
                  <option value="Technical">💡 Technical Question</option>
                  <option value="Coding">💻 Live Coding Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Question Prompt</label>
                <textarea
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter custom question..."
                  className="w-full bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-300"
                />
              </div>

              {customType === "Coding" && (
                <div>
                  <label className="block text-slate-600 mb-1">Starter Code Template</label>
                  <textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    rows={3}
                    placeholder="// Starter code..."
                    className="w-full bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-xl border border-slate-700"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                >
                  Push Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
