import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import { useAuth } from "../../context/AuthContext";
import { getLiveInterviewRoomById, runCodeInRoom, submitAndEndInterview } from "../../services/liveInterviewService";
import {
  FaUserTie,
  FaClock,
  FaPlay,
  FaPaperPlane,
  FaCode,
  FaCheckCircle,
  FaSpinner,
  FaMagic,
  FaTrophy,
  FaTimes,
} from "react-icons/fa";

export default function CandidateInterviewRoom() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "INT123";
  const navigate = useNavigate();
  const { user } = useAuth();

  const candidateName = user?.name || "Priyanshu";

  // Room State
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewerOnline, setInterviewerOnline] = useState(false);
  const [status, setStatus] = useState("active");
  const [timerRemaining, setTimerRemaining] = useState(1800); // seconds

  // Questions & Answers
  const [question, setQuestion] = useState("Explain Redis caching.");
  const [textAnswer, setTextAnswer] = useState("");
  const [code, setCode] = useState(`function firstNonRepeating(str) {\n  // Write solution here\n  return "";\n}\n`);
  const [language, setLanguage] = useState("javascript");

  // Execution & AI Feedback
  const [executing, setExecuting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Chat & Typing
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  const debounceTimerRef = useRef(null);

  // Load initial room data
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setStatus(res.room.status || "active");
          setQuestion(res.room.currentQuestion || "Explain Redis caching.");
          setTextAnswer(res.room.currentTextAnswer || "");
          setCode(res.room.currentCode || "");
          setTimerRemaining(res.room.timerRemaining || 1800);
          setChatMessages(res.room.chatMessages || []);
          if (res.room.aiFeedback) {
            setAiReport(res.room.aiFeedback);
          }
        }
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomId]);

  // Socket Connection & Event Listeners
  useEffect(() => {
    socket.emit("join_interview", { roomId, role: "Candidate", userName: candidateName });

    socket.on("participant_presence", (data) => {
      setInterviewerOnline(!!data.interviewerOnline);
    });

    socket.on("timer_tick", ({ timerRemaining: newTime, status: newStatus }) => {
      setTimerRemaining(newTime);
      if (newStatus) setStatus(newStatus);
    });

    socket.on("question_changed", ({ question: newQ }) => {
      setQuestion(newQ);
    });

    socket.on("typing_indicator", ({ isTyping, userName }) => {
      if (isTyping && userName !== candidateName) {
        setTypingUser(userName);
      } else {
        setTypingUser(null);
      }
    });

    socket.on("receive_message", (msgObj) => {
      setChatMessages((prev) => [...prev, msgObj]);
    });

    socket.on("interview_ended", ({ room: updatedRoom }) => {
      setStatus("completed");
      if (updatedRoom?.aiFeedback) {
        setAiReport(updatedRoom.aiFeedback);
        setShowAiModal(true);
      }
    });

    return () => {
      socket.off("participant_presence");
      socket.off("timer_tick");
      socket.off("question_changed");
      socket.off("typing_indicator");
      socket.off("receive_message");
      socket.off("interview_ended");
    };
  }, [roomId, candidateName]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typingUser]);

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Text Answer Debounced Sync to Admin
  const handleTextAnswerChange = (e) => {
    const val = e.target.value;
    setTextAnswer(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      socket.emit("answer_typing", { roomId, textAnswer: val });
    }, 400);
  };

  // Code Editor Change Sync
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("code_changed", { roomId, code: newCode, language });
  };

  // Run Code via Judge0
  const handleRunCode = async () => {
    setExecuting(true);
    try {
      const res = await runCodeInRoom(roomId, { code, language });
      if (res.success) {
        setOutputResult(res.result);
      }
    } catch (err) {
      console.error("Code run error:", err);
      setOutputResult({ error: err.message || "Execution error" });
    } finally {
      setExecuting(false);
    }
  };

  // Submit Answer & End Interview
  const handleSubmitInterview = async () => {
    setSubmitting(true);
    try {
      const res = await submitAndEndInterview(roomId, { textAnswer, code });
      if (res.success) {
        setStatus("completed");
        if (res.aiFeedback) {
          setAiReport(res.aiFeedback);
          setShowAiModal(true);
        }
        socket.emit("end_interview", { roomId });
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Chat Send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit("send_message", {
      roomId,
      senderName: candidateName,
      role: "Candidate",
      message: chatInput.trim(),
    });
    setChatInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-sky-400 flex flex-col items-center justify-center font-sans">
        <FaSpinner className="text-4xl animate-spin mb-3 text-sky-400" />
        <p className="text-sm font-semibold tracking-wide">Connecting to Live Interview Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {/* TOP HEADER BAR */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <FaUserTie className="text-lg" />
          </div>
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              YOUR LIVE INTERVIEW
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                {roomId}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Candidate: {candidateName}</p>
          </div>
        </div>

        {/* INTERVIEWER STATUS & TIMER */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Interviewer:</span>
            <span className="text-xs font-bold text-white">{room?.interviewerName || "Rahul"}</span>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                interviewerOnline
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${interviewerOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500"}`} />
              {interviewerOnline ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 bg-slate-950/90 px-4 py-1.5 rounded-xl border border-slate-800">
            <FaClock className="text-amber-400 animate-pulse text-sm" />
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block leading-none">
                Time Remaining
              </span>
              <span className="font-mono text-base font-extrabold text-white leading-tight">
                {formatTime(timerRemaining)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: QUESTION + TEXT ANSWER + CODE EDITOR */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto">
          {/* LIVE QUESTION BOX */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <FaMagic /> Question Pushed by Interviewer
              </span>
              <span className="text-[11px] font-bold text-emerald-400">🟢 Live Synchronized</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90">
              <p className="text-base font-bold text-white leading-relaxed">{question}</p>
            </div>
          </div>

          {/* YOUR TEXT ANSWER */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-indigo-400">
                Your Answer (Live Streamed to Interviewer)
              </label>
              <span className="text-[10px] text-slate-500">Auto-syncs as you type</span>
            </div>
            <textarea
              value={textAnswer}
              onChange={handleTextAnswerChange}
              rows={4}
              placeholder="Type your explanation or answer here..."
              className="w-full bg-slate-950 text-slate-100 text-xs p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
            />
          </div>

          {/* CODE EDITOR SECTION */}
          <div className="flex-1 flex flex-col min-h-[350px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaCode className="text-emerald-400 text-sm" />
                <span className="text-xs font-bold text-slate-200">Live Code Editor</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <FaPlay className="text-[10px]" />
                  <span>{executing ? "Running..." : "Run Code (Judge0)"}</span>
                </button>
                <button
                  onClick={handleSubmitInterview}
                  disabled={submitting}
                  className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <FaCheckCircle className="text-[10px]" />
                  <span>{submitting ? "Submitting..." : "Submit Answer"}</span>
                </button>
              </div>
            </div>

            {/* MONACO EDITOR */}
            <div className="flex-1 relative bg-[#090d16]">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            {/* JUDGE0 EXECUTION OUTPUT */}
            {outputResult && (
              <div className="h-32 bg-slate-950 border-t border-slate-800 p-3 font-mono text-xs overflow-y-auto">
                <div className="flex items-center justify-between mb-1 text-slate-400">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Execution Output</span>
                  <button onClick={() => setOutputResult(null)} className="text-[10px] hover:text-white">
                    Close
                  </button>
                </div>
                {outputResult.output && <pre className="text-emerald-300">{outputResult.output}</pre>}
                {outputResult.error && <pre className="text-rose-400">{outputResult.error}</pre>}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: REAL-TIME CHAT */}
        <div className="w-96 flex flex-col bg-slate-900/90 border-l border-slate-800">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
              Chat with Interviewer
            </span>
            <span className="text-[10px] text-slate-500 font-bold">{chatMessages.length} msgs</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
            {chatMessages.map((msg) => {
              const isMe = msg.senderName === candidateName;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] text-xs p-3 rounded-2xl leading-relaxed ${
                      isMe
                        ? "bg-sky-600 text-white rounded-br-none shadow-md shadow-sky-600/20"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}

            {typingUser && (
              <div className="text-xs text-sky-400 italic pt-1 animate-pulse">
                <span>{typingUser} is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to interviewer..."
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md transition"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* GROQ AI EVALUATION REPORT MODAL */}
      {showAiModal && aiReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <FaTrophy className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">AI Evaluation & Performance Report</h2>
                  <p className="text-xs text-slate-400">Generated automatically via Groq AI Engine</p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white p-2">
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Overall Score</span>
                <span className="text-3xl font-black text-emerald-400">{aiReport.score || 88} / 100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Technical Rating</span>
                <span className="text-lg font-bold text-sky-400">{aiReport.technicalRating || "Strong Candidate"}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-1">Summary Evaluation</h4>
                <p className="text-slate-400 leading-relaxed">{aiReport.summary}</p>
              </div>

              {aiReport.strengths && aiReport.strengths.length > 0 && (
                <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-400 mb-1">Key Strengths</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {aiReport.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
