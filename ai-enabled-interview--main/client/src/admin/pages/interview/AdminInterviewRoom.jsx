import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../../socket";
import { getLiveInterviewRoomById, submitAndEndInterview } from "../../../services/liveInterviewService";
import {
  FaUserGraduate,
  FaClock,
  FaPlay,
  FaPause,
  FaStop,
  FaPaperPlane,
  FaCode,
  FaCheckCircle,
  FaSpinner,
  FaMagic,
  FaCopy,
  FaCheck,
  FaTerminal,
} from "react-icons/fa";

export default function AdminInterviewRoom() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "INT123";
  const navigate = useNavigate();

  // State
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateOnline, setCandidateOnline] = useState(false);
  const [status, setStatus] = useState("active");
  const [timerRemaining, setTimerRemaining] = useState(1800); // seconds

  // Questions & Answers
  const [currentQuestion, setCurrentQuestion] = useState("Explain Redis caching.");
  const [newQuestionInput, setNewQuestionInput] = useState("");
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [candidateCode, setCandidateCode] = useState("// Candidate code will appear here live...\n");

  // Chat & Typing
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  const [copied, setCopied] = useState(false);

  // Load initial room data
  useEffect(() => {
    async function initRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setStatus(res.room.status || "active");
          setCurrentQuestion(res.room.currentQuestion || "Explain Redis caching.");
          setCandidateAnswer(res.room.currentTextAnswer || "");
          setCandidateCode(res.room.currentCode || "");
          setTimerRemaining(res.room.timerRemaining || 1800);
          setChatMessages(res.room.chatMessages || []);
        }
      } catch (err) {
        console.error("Error loading room:", err);
      } finally {
        setLoading(false);
      }
    }
    initRoom();
  }, [roomId]);

  // Socket setup
  useEffect(() => {
    socket.emit("join_interview", { roomId, role: "Admin", userName: "Rahul" });

    socket.on("participant_presence", (data) => {
      setCandidateOnline(!!data.candidateOnline);
    });

    socket.on("timer_tick", ({ timerRemaining: newTime, status: newStatus }) => {
      setTimerRemaining(newTime);
      if (newStatus) setStatus(newStatus);
    });

    socket.on("question_changed", ({ question }) => {
      setCurrentQuestion(question);
    });

    socket.on("answer_updated", ({ textAnswer }) => {
      setCandidateAnswer(textAnswer);
    });

    socket.on("code_updated", ({ code }) => {
      setCandidateCode(code);
    });

    socket.on("typing_indicator", ({ isTyping, userName }) => {
      if (isTyping && userName !== "Rahul") {
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
      if (updatedRoom) setRoom(updatedRoom);
    });

    return () => {
      socket.off("participant_presence");
      socket.off("timer_tick");
      socket.off("question_changed");
      socket.off("answer_updated");
      socket.off("code_updated");
      socket.off("typing_indicator");
      socket.off("receive_message");
      socket.off("interview_ended");
    };
  }, [roomId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typingUser]);

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Actions
  const handleStartInterview = () => {
    setStatus("active");
    socket.emit("start_interview", { roomId });
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    setCurrentQuestion(newQuestionInput.trim());
    socket.emit("ask_question", { roomId, question: newQuestionInput.trim() });
    setNewQuestionInput("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit("send_message", {
      roomId,
      senderName: "Rahul (Admin)",
      role: "Interviewer",
      message: chatInput.trim(),
    });
    setChatInput("");
  };

  const handleEndInterview = async () => {
    try {
      const res = await submitAndEndInterview(roomId, {
        textAnswer: candidateAnswer,
        code: candidateCode,
      });
      setStatus("completed");
      if (res.room) setRoom(res.room);
      socket.emit("end_interview", { roomId });
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
      <div className="min-h-screen bg-slate-950 text-sky-400 flex flex-col items-center justify-center font-sans">
        <FaSpinner className="text-4xl animate-spin mb-3 text-indigo-400" />
        <p className="text-sm font-semibold tracking-wide">Connecting to Live Interview Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* TOP BAR */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <FaUserGraduate className="text-lg" />
            </div>
            <div>
              <h1 className="text-base font-black text-white flex items-center gap-2">
                LIVE INTERVIEW ROOM
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {roomId}
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Interviewer: Rahul ↔ Socket.IO ↔ Candidate</p>
            </div>
          </div>

          <button
            onClick={copyRoomId}
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 transition"
          >
            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copied ? "Copied ID" : "Copy Room ID"}</span>
          </button>
        </div>

        {/* CANDIDATE STATUS & TIMER & CONTROLS */}
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Candidate:</span>
            <span className="text-xs font-bold text-white">{room?.candidateName || "Priyanshu"}</span>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                candidateOnline
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${candidateOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500"}`} />
              {candidateOnline ? "🟢 Online" : "🔴 Offline"}
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

          <button
            onClick={handleEndInterview}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            <FaStop />
            <span>End Interview</span>
          </button>
        </div>
      </header>

      {/* MAIN SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: QUESTION + TEXT ANSWER + LIVE MONACO EDITOR */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto">
          {/* ASK QUESTION PANEL */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <FaMagic /> Current Question
              </span>
              <span className="text-[11px] font-bold text-slate-400">Status: {status.toUpperCase()}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90">
              <p className="text-base font-bold text-white leading-relaxed">{currentQuestion}</p>
            </div>

            <form onSubmit={handleAskQuestion} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                placeholder="Type a new question to send to candidate..."
                className="flex-1 bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition shrink-0"
              >
                Ask Question
              </button>
            </form>
          </div>

          {/* CANDIDATE TEXT ANSWER DISPLAY */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/30">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-2">
              Candidate Written Answer (Live Stream)
            </h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 min-h-24 font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {candidateAnswer || <span className="text-slate-600 italic">Candidate is typing text answer...</span>}
            </div>
          </div>

          {/* CANDIDATE LIVE MONACO CODE EDITOR */}
          <div className="flex-1 flex flex-col min-h-[350px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaCode className="text-emerald-400 text-sm" />
                <span className="text-xs font-bold text-slate-200">Candidate's Live Code View</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">JavaScript</span>
            </div>

            <div className="flex-1 relative bg-[#090d16]">
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={candidateCode}
                options={{
                  readOnly: true,
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CHAT & SESSION CONTROL */}
        <div className="w-96 flex flex-col bg-slate-900/90 border-l border-slate-800">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
              Live Chat & Transcripts
            </span>
            <span className="text-[10px] text-slate-500 font-bold">{chatMessages.length} msgs</span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
            {chatMessages.map((msg) => {
              const isMe = msg.senderName.includes("Rahul");
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
                        ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20"
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

          {/* CHAT INPUT */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to candidate..."
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
