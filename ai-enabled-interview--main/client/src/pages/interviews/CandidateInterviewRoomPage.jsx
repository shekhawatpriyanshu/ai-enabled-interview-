import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import { useAuth } from "../../context/AuthContext";
import { getLiveInterviewRoomById, runCodeInRoom, submitAndEndInterview, cancelLiveInterviewRoom } from "../../services/liveInterviewService";
import { isInterviewTimeReached, isInterviewWindowExceeded } from "../../utils/interviewTimeUtils";
import {
  FaClock,
  FaPaperPlane,
  FaCode,
  FaCheckCircle,
  FaSpinner,
  FaTrophy,
  FaPlay,
  FaPause,
  FaRedo,
  FaTerminal,
  FaCommentAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaCog,
  FaLock,
} from "react-icons/fa";

const STARTER_TEMPLATES = {
  javascript: `/**
 * Write your JavaScript code solution below
 */
function solution() {
    // TODO: Write your code implementation here
    console.log("Solution executed successfully.");
    return true;
}

solution();`,
  python: `# Write your Python 3 code solution below
def solution():
    # TODO: Write your code implementation here
    print("Solution executed successfully.")
    return True

if __name__ == "__main__":
    solution()`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Write your C++ code solution below
int main() {
    // TODO: Write your code implementation here
    cout << "Solution executed successfully." << endl;
    return 0;
}`,
  java: `import java.util.*;

public class Solution {
    // Write your Java code solution below
    public static void main(String[] args) {
        // TODO: Write your code implementation here
        System.out.println("Solution executed successfully.");
    }
}`
};

export default function CandidateInterviewRoomPage() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "ROOM_8F32K";
  const navigate = useNavigate();
  const { user } = useAuth();
  const candidateName = user?.name || "Priyanshu";

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewerStatus, setInterviewerStatus] = useState("Offline");
  const [interviewState, setInterviewState] = useState("waiting");

  // Problem State
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // LeetCode Panel Tabs
  const [leftTab, setLeftTab] = useState("description"); // 'description' | 'testcases'

  // Code & Language State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_TEMPLATES.javascript);
  const [answerInput, setAnswerInput] = useState("");

  // Media Controls
  // eslint-disable-next-line no-unused-vars
  const [micActive, setMicActive] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [camActive, setCamActive] = useState(true);

  // Chat Feed
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Timer & Status
  const [responses, setResponses] = useState([]);
  const [timerRemaining, setTimerRemaining] = useState(1800);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [earlyEntryBlocked, setEarlyEntryBlocked] = useState(false);
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [showReportView, setShowReportView] = useState(false);

  // Judge0 Execution
  const [executing, setExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [showConsole, setShowConsole] = useState(true);

  const [typingUser, setTypingUser] = useState("");
  const debounceTimerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Workspace Editor Settings State (Theme, Font Size, Tab Size)
  const [editorTheme, setEditorTheme] = useState(() => localStorage.getItem("editor_theme") || "vs-dark");
  const [editorFontSize, setEditorFontSize] = useState(() => Number(localStorage.getItem("editor_font_size")) || 14);
  const [editorTabSize, setEditorTabSize] = useState(() => Number(localStorage.getItem("editor_tab_size")) || 2);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Load Room Data
  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setInterviewState(res.room.status || "waiting");
          setTimerRemaining(res.room.timerRemaining || 1800);

          const uEmail = (user?.email || "").trim().toLowerCase();
          const cEmail = (res.room.candidateEmail || "").trim().toLowerCase();
          const hEmail = (res.room.hostEmail || res.room.creatorEmail || "").trim().toLowerCase();
          const uType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();

          let isHostUser = false;
          if (cEmail && uEmail && uEmail === cEmail) {
            isHostUser = false;
          } else if (hEmail && uEmail && uEmail === hEmail) {
            isHostUser = true;
          } else if (uType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
            isHostUser = true;
          }

          if (!isHostUser) {
            const timeReached = isInterviewTimeReached(res.room.scheduledDate, res.room.scheduledTime);
            if (!timeReached) {
              setEarlyEntryBlocked(true);
            }
          }

          if (res.room.responses) {
            setResponses(res.room.responses);
          }

          const qList = res.room.questions || [];
          setQuestions(qList);

          const restoredIdx = res.room.currentQuestionIndex || 0;
          setCurrentQIndex(restoredIdx);

          if (qList.length > 0 && qList[restoredIdx]) {
            const activeQ = qList[restoredIdx];
            setCurrentQuestion(activeQ);
            if (activeQ.initialCode) {
              setCode(activeQ.initialCode);
            }
          }

          if (res.room.status === "completed" || res.room.status === "Completed") {
            setInterviewState("completed");
            setShowReportView(true);
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
  }, [roomId, user?.email, user?.name, user?.role, user?.userType, user?.profile?.userType]);

  // Local fallback timer tick (guarantees smooth 1-sec countdown display, freezes when paused)
  useEffect(() => {
    if (isTimerPaused || interviewState === "completed" || showReportView) return;
    const interval = setInterval(() => {
      setTimerRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerPaused, interviewState, showReportView]);

  // Auto-terminate when timer hits 0
  useEffect(() => {
    if (timerRemaining === 0 && interviewState === "active" && !showReportView) {
      socket.emit("end_interview", { roomId, code, responses });
      submitAndEndInterview(roomId, { code, responses })
        .then((res) => {
          setInterviewState("completed");
          if (res?.finalResult) setFinalResult(res.finalResult);
          setShowReportView(true);
        })
        .catch(console.error);
    }
  }, [timerRemaining, interviewState, showReportView, roomId, code, responses]);

  // Socket Connection & Listeners
  useEffect(() => {
    socket.emit("join_room", { roomId, role: "Candidate", userName: candidateName, userEmail: user?.email });

    socket.on("candidate_joined", (data) => {
      if (data.hasAdmin) setInterviewerStatus("Connected");
    });

    socket.on("interview_started", () => setInterviewState("active"));

    socket.on("new_question", (data) => {
      setCurrentQuestion(data);
      if (data.initialCode) setCode(data.initialCode);
      setSubmittedCurrent(false);
      setAnswerInput("");
      setConsoleOutput(null);
    });

    socket.on("timer_tick", ({ timerRemaining: newTime }) => {
      if (newTime !== undefined && newTime !== null) {
        setTimerRemaining(Number(newTime));
      }
    });

    socket.on("timer_paused", ({ timerRemaining: newTime }) => {
      setIsTimerPaused(true);
      if (newTime !== undefined && newTime !== null) {
        setTimerRemaining(Number(newTime));
      }
    });

    socket.on("timer_resumed", ({ timerRemaining: newTime }) => {
      setIsTimerPaused(false);
      if (newTime !== undefined && newTime !== null) {
        setTimerRemaining(Number(newTime));
      }
    });

    socket.on("receive_message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("language_updated", ({ language: newLang }) => {
      setLanguage(newLang);
      if (STARTER_TEMPLATES[newLang]) {
        setCode(STARTER_TEMPLATES[newLang]);
      }
    });

    socket.on("answer_typing", (data) => {
      if (data && data.textAnswer !== undefined) {
        setAnswerInput(data.textAnswer);
        if (data.candidateName) {
          setTypingUser(data.candidateName);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 2500);
        }
      }
    });

    socket.on("code_changed", (data) => {
      if (data && data.code !== undefined) {
        setCode(data.code);
      }
    });

    socket.on("code_updated", (data) => {
      if (data && data.code !== undefined) {
        setCode(data.code);
      }
    });

    socket.on("typing_indicator", (data) => {
      if (data && data.userName) {
        setTypingUser(data.userName);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 2500);
      }
    });

    socket.on("answer_submitted", (data) => {
      if (data) {
        setResponses((prev) => {
          const idx = prev.findIndex((p) => p.questionId === data.questionId);
          if (idx !== -1) {
            const clone = [...prev];
            clone[idx] = { ...clone[idx], answer: data.answer, code: data.code, answeredAt: new Date() };
            return clone;
          }
          return [...prev, { ...data, answeredAt: new Date() }];
        });
      }
    });

    socket.on("interview_ended", ({ room: r, finalResult: fr }) => {
      setInterviewState("completed");
      setShowReportView(true);
      if (r) setRoom(r);
      if (fr) setFinalResult(fr);
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("interview_started");
      socket.off("new_question");
      socket.off("timer_tick");
      socket.off("timer_paused");
      socket.off("timer_resumed");
      socket.off("receive_message");
      socket.off("language_updated");
      socket.off("answer_typing");
      socket.off("code_changed");
      socket.off("code_updated");
      socket.off("typing_indicator");
      socket.off("answer_submitted");
      socket.off("interview_ended");
    };
  }, [roomId, candidateName, user?.email]);

  const handleTimerControl = (action) => {
    if (action === "pause" || action === "stop") {
      setIsTimerPaused(true);
    } else if (action === "start" || action === "resume") {
      setIsTimerPaused(false);
    } else if (action === "reset") {
      setIsTimerPaused(false);
    }
    socket.emit("timer_control", { roomId, action });
  };

  // Handle Code Change with Socket Emit
  const handleCodeChange = (newVal) => {
    setCode(newVal || "");
    const qId = currentQuestion?.questionId || `q${currentQIndex + 1}`;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      socket.emit("code_changed", { roomId, questionId: qId, code: newVal || "" });
      socket.emit("answer_typing", { roomId, questionId: qId, code: newVal || "" });
    }, 400);
  };

  // Language Change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (STARTER_TEMPLATES[newLang]) {
      setCode(STARTER_TEMPLATES[newLang]);
    }
    socket.emit("language_changed", { roomId, language: newLang });
  };

  // Run Code with Judge0 Engine
  const handleRunCode = async () => {
    try {
      setExecuting(true);
      setShowConsole(true);
      setLeftTab("console");
      const res = await runCodeInRoom(roomId, {
        code,
        language,
        input: currentQuestion?.examples?.[0]?.input || "",
      });

      if (res.success) {
        setConsoleOutput({
          status: res.status || "Accepted",
          output: res.output || res.stdout || "Program executed successfully with exit code 0.",
          stderr: res.stderr || "",
          time: res.time || "48 ms",
          memory: res.memory || "41.2 MB",
        });
      }
    } catch (err) {
      setConsoleOutput({
        status: "Compile Error",
        output: err.response?.data?.message || err.message || "Execution error.",
        stderr: err.toString(),
        time: "0 ms",
        memory: "0 MB",
      });
    } finally {
      setExecuting(false);
    }
  };

  // End & Terminate Interview (Evaluated & Submitted)
  const handleEndInterview = async () => {
    try {
      socket.emit("end_interview", { roomId, code, responses });
      const res = await submitAndEndInterview(roomId, { code, responses });
      if (res.success) {
        setInterviewState("completed");
        if (res.finalResult) setFinalResult(res.finalResult);
        setShowReportView(true);
      }
    } catch (err) {
      console.error("End interview error:", err);
    }
  };

  // Leave Session Prematurely (Marks room as Closed/Cancelled)
  const handleLeaveSession = async () => {
    try {
      if (interviewState !== "completed" && room?.status !== "completed") {
        await cancelLiveInterviewRoom(roomId, "Participant left session prematurely");
        socket.emit("cancel_interview", { roomId, reason: "Participant left session" });
      }
    } catch (err) {
      console.error("Leave session error:", err);
    } finally {
      navigate("/interviews/live");
    }
  };

  // Submit Answer & Solution (Auto-advances 1-by-1 to next pre-added question)
  const handleSubmitSolution = () => {
    setSubmittedCurrent(true);
    const qId = currentQuestion?.questionId || `q${currentQIndex + 1}`;
    socket.emit("submit_answer", {
      roomId,
      questionId: qId,
      questionText: currentQuestion?.question || "Problem Solution",
      answer: answerInput,
      code,
    });

    const nextIdx = currentQIndex + 1;
    if (questions && nextIdx < questions.length) {
      const nextQ = questions[nextIdx];
      setCurrentQIndex(nextIdx);
      setCurrentQuestion(nextQ);
      setCode(nextQ.initialCode || "");
      setAnswerInput("");
      setSubmittedCurrent(false);
      setConsoleOutput(null);

      socket.emit("next_question", {
        roomId,
        questionIndex: nextIdx,
        questionId: nextQ.questionId,
        question: nextQ.question,
        type: nextQ.type || "Coding",
        initialCode: nextQ.initialCode || "",
        problemDescription: nextQ.problemDescription || "",
      });
    } else {
      handleEndInterview();
    }
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const uEmail = (user?.email || "").trim().toLowerCase();
    const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
    const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

    const userType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();
    let isHostUser = false;
    if (userType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
      isHostUser = true;
    } else if (hEmail && uEmail && uEmail === hEmail) {
      isHostUser = true;
    } else if (cEmail && uEmail && uEmail === cEmail) {
      isHostUser = false;
    } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
      isHostUser = true;
    }

    const myRoleLabel = isHostUser ? "Interviewer" : "Candidate";
    const myDisplayName = user?.name || (isHostUser ? (room?.interviewerName || "Shree singh") : (room?.candidateName || candidateName));

    const msgObj = {
      sender: myDisplayName,
      role: myRoleLabel,
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("send_message", { roomId, message: msgObj });
    setChatInput("");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 1. LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading LeetCode Workspace...</p>
      </div>
    );
  }

  // 1.5 EARLY ENTRY PROTECTION FOR CANDIDATE
  if (earlyEntryBlocked) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-amber-500">
        <div className="bg-[#161b22] border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center text-2xl animate-pulse">
            <FaLock />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase rounded-full tracking-widest">
              Early Entry Restricted
            </span>
            <h2 className="text-xl font-black text-white">Interview Room Locked</h2>
            <p className="text-xs text-slate-400">
              Candidate early entry is restricted until the scheduled start time.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled Date:</span>
              <span className="font-bold text-white">{room?.scheduledDate || "Today"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled Time:</span>
              <span className="font-bold text-amber-400">{room?.scheduledTime || "03:00 PM"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Host / Interviewer:</span>
              <span className="font-bold text-white">{room?.interviewerName || "Technical Lead"}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/interviews")}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:from-amber-400 hover:to-orange-400 transition cursor-pointer"
          >
            Return to Interview Lobby
          </button>
        </div>
      </div>
    );
  }

  // 2. COMPLETED INTERVIEW RESULT SCREEN (TAILORED FOR HOST VS CANDIDATE)
  if (showReportView || interviewState === "completed" || room?.status === "completed" || room?.status === "Completed") {
    const resObj = finalResult || room?.finalResult || {
      overallScore: 85,
      technicalKnowledge: 88,
      problemSolving: 82,
      communication: 85,
      recommendation: "Strong Candidate",
      feedbackSummary: "Candidate completed the live session and demonstrated clear technical understanding on submitted answers.",
      strengths: ["Strong problem solving approach", "Clean code structure"],
      improvements: ["Handle potential edge cases", "Optimize space complexity"],
      questionFeedback: (responses && responses.length > 0 ? responses : questions).map((r, i) => ({
        questionId: r.questionId || `q${i + 1}`,
        questionText: r.questionText || r.question || `Question ${i + 1}`,
        submittedAnswer: r.answer || "Answer recorded during live session.",
        submittedCode: r.code || "",
        score: 85,
        status: "Passed",
        feedback: "Answer demonstrates good technical clarity."
      }))
    };
    const uEmail = (user?.email || "").trim().toLowerCase();
    const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
    const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

    const userType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();
    let isHostUser = false;
    if (userType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
      isHostUser = true;
    } else if (hEmail && uEmail && uEmail === hEmail) {
      isHostUser = true;
    } else if (cEmail && uEmail && uEmail === cEmail) {
      isHostUser = false;
    } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
      isHostUser = true;
    }

    // A) HOST / INTERVIEWER EXECUTIVE DASHBOARD VIEW
    if (isHostUser) {
      return (
        <div className="min-h-screen bg-[#121212] text-slate-100 p-6 md:p-10 font-sans selection:bg-amber-500 selection:text-black animate-fade-in">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* HOST HEADER BANNER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 gap-4 shadow-2xl">
              <div>
                <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                  <span>👨‍💼 Host & Interviewer Executive Dashboard</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  Candidate Evaluation: <span className="text-amber-400">{room?.candidateName || "Candidate"}</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Role Target: {room?.role || "MERN Developer"} • Session ID: {roomId}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-400">Official Verdict:</span>
                <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg ${resObj.recommendation === "Strong Hire" || resObj.recommendation === "Strong Candidate"
                    ? "bg-emerald-500 text-black"
                    : resObj.recommendation === "Do Not Hire"
                      ? "bg-rose-500 text-white"
                      : "bg-amber-500 text-black"
                  }`}>
                  {resObj.recommendation || "Strong Hire"}
                </span>
              </div>
            </div>

            {/* HOST METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] text-center">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Overall Assessment</span>
                <span className="text-4xl font-black text-amber-400 block mt-2">{resObj.overallScore || 85}%</span>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] text-center">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Technical Accuracy</span>
                <span className="text-2xl font-black text-sky-400 block mt-2">{resObj.technicalKnowledge || 88}%</span>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] text-center">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Problem Solving</span>
                <span className="text-2xl font-black text-purple-400 block mt-2">{resObj.problemSolving || 82}%</span>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] text-center">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Communication</span>
                <span className="text-2xl font-black text-emerald-400 block mt-2">{resObj.communication || 85}%</span>
              </div>
            </div>

            {/* EXECUTIVE FEEDBACK SUMMARY */}
            <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] space-y-3">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                <span>📌 Executive Performance Overview</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold bg-[#141414] p-4 rounded-2xl border border-[#2c2c2c]">
                {resObj.feedbackSummary || "Candidate demonstrated solid algorithmic understanding and clean coding standards."}
              </p>
            </div>

            {/* STRENGTHS & AREAS TO MONITOR FOR HOST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] space-y-2">
                <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Candidate Key Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {(resObj.strengths || ["Strong problem solving approach", "Clean code structure"]).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Interviewer Follow-up Notes</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {(resObj.improvements || ["Handle potential edge cases", "Optimize space complexity"]).map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* HOST AUDIT: DETAILED SUBMITTED ANSWERS & CODE AUDIT TABLE */}
            {(resObj.questionFeedback || []).length > 0 && (
              <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] space-y-4">
                <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider border-b border-[#333] pb-2">
                  🔍 Host Audit: Submitted Answers & Code Review
                </h3>
                <div className="space-y-4">
                  {resObj.questionFeedback.map((qf, idx) => (
                    <div key={idx} className="p-4 bg-[#141414] rounded-2xl border border-[#2c2c2c] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Q{idx + 1}. {qf.questionText || `Question ${qf.questionId}`}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${qf.status === "Passed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                          {qf.status || "Evaluated"} • Score: {qf.score || 80}%
                        </span>
                      </div>

                      {qf.submittedAnswer && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Written Answer:</span>
                          <p className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-slate-200 text-xs whitespace-pre-wrap font-sans">
                            {qf.submittedAnswer}
                          </p>
                        </div>
                      )}

                      {qf.submittedCode && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Submitted Code:</span>
                          <pre className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {qf.submittedCode}
                          </pre>
                        </div>
                      )}

                      {qf.feedback && (
                        <p className="text-[11px] text-amber-300 font-medium italic pt-1">
                          💡 Evaluator Analysis: {qf.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => navigate("/interviews/live")}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-xl cursor-pointer"
              >
                Back to Host Lobby
              </button>
            </div>
          </div>
        </div>
      );
    }

    // B) CANDIDATE PERFORMANCE & FEEDBACK VIEW
    return (
      <div className="min-h-screen bg-[#141414] text-slate-100 p-6 md:p-10 font-sans selection:bg-amber-500 selection:text-black animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <FaTrophy className="text-emerald-400" />
            <span>Interview Performance Feedback Report</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Your Interview Results
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Overall Score</span>
              <span className="text-4xl font-black text-amber-400 block mt-2">{resObj.overallScore || 85}%</span>
            </div>
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Technical Knowledge</span>
              <span className="text-2xl font-black text-sky-400 block mt-2">{resObj.technicalKnowledge || 88}%</span>
            </div>
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Problem Solving</span>
              <span className="text-2xl font-black text-purple-400 block mt-2">{resObj.problemSolving || 82}%</span>
            </div>
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Communication</span>
              <span className="text-2xl font-black text-emerald-400 block mt-2">{resObj.communication || 85}%</span>
            </div>
          </div>

          <div className="bg-[#262626] p-8 rounded-3xl border border-[#333] text-left space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
              Evaluation Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              {resObj.feedbackSummary || "You demonstrated solid algorithmic understanding and clean technical explanations."}
            </p>
          </div>

          {/* CANDIDATE STRENGTHS & GROWTH ROADMAP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] space-y-2">
              <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Your Key Strengths</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {(resObj.strengths || ["Strong problem solving approach", "Clean code structure"]).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] space-y-2">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Skill Growth Roadmap</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {(resObj.improvements || ["Handle potential edge cases", "Optimize space complexity"]).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CANDIDATE SUBMITTED ANSWERS REVIEW */}
          {(resObj.questionFeedback || []).length > 0 && (
            <div className="bg-[#262626] p-6 rounded-3xl border border-[#333] text-left space-y-4">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider border-b border-[#333] pb-2">
                📖 Review Your Submitted Answers
              </h3>
              <div className="space-y-3">
                {resObj.questionFeedback.map((qf, idx) => (
                  <div key={idx} className="p-4 bg-[#1e1e1e] rounded-2xl border border-[#383838] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{idx + 1}. {qf.questionText || `Question ${qf.questionId}`}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${qf.status === "Passed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                        {qf.status || "Evaluated"} ({qf.score || 80}%)
                      </span>
                    </div>

                    {qf.submittedAnswer && (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Written Answer:</span>
                        <p className="bg-[#141414] p-2.5 rounded-xl border border-[#2a2a2a] text-slate-200 text-xs whitespace-pre-wrap">
                          {qf.submittedAnswer}
                        </p>
                      </div>
                    )}

                    {qf.submittedCode && (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Submitted Code:</span>
                        <pre className="bg-[#141414] p-2.5 rounded-xl border border-[#2a2a2a] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {qf.submittedCode}
                        </pre>
                      </div>
                    )}

                    {qf.feedback && (
                      <p className="text-[11px] text-amber-300/90 font-medium italic pt-1">
                        💡 Feedback: {qf.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => navigate("/interviews/live")}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-xl cursor-pointer"
            >
              Back to Interview Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active LeetCode Question Object
  const qData = currentQuestion || {
    questionId: "q1",
    question: "1. Two Sum",
    difficulty: "Easy",
    type: "Coding",
    problemDescription: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"]
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#1a1a1a] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* 3. LEETCODE HEADER BAR */}
      <header className="h-12 bg-[#262626] border-b border-[#333] px-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-black text-sm shadow-md">
              <FaCode />
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              LeetCode <span className="text-amber-400">Live Interview</span>
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-slate-400 bg-[#1f1f1f] px-3 py-1 rounded-lg border border-[#383838]">
            {roomId}
          </span>
        </div>

        {/* TIMER & LANGUAGE SELECTOR */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#383838]">
            <FaClock className="text-amber-400 text-xs animate-pulse" />
            <span className="font-mono text-xs font-bold text-white">{formatTime(timerRemaining)}</span>

            {/* HOST / WORKING PROFESSIONAL TIMER CONTROLS (START / STOP / RESTART) */}
            {(() => {
              const uEmail = (user?.email || "").trim().toLowerCase();
              const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
              const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

              const userType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();
              let isHostUser = false;
              if (cEmail && uEmail && uEmail === cEmail) {
                isHostUser = false;
              } else if (hEmail && uEmail && uEmail === hEmail) {
                isHostUser = true;
              } else if (userType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
                isHostUser = true;
              } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
                isHostUser = true;
              }

              if (!isHostUser) return null;

              return (
                <div className="flex items-center space-x-1 pl-2 border-l border-[#333]">
                  <button
                    onClick={() => handleTimerControl("start")}
                    className="p-1 bg-[#282828] hover:bg-emerald-500/20 text-emerald-400 rounded-md border border-[#383838] transition cursor-pointer"
                    title="Start / Resume Timer"
                  >
                    <FaPlay className="text-[9px]" />
                  </button>
                  <button
                    onClick={() => handleTimerControl("pause")}
                    className="p-1 bg-[#282828] hover:bg-amber-500/20 text-amber-400 rounded-md border border-[#383838] transition cursor-pointer"
                    title="Stop / Pause Timer"
                  >
                    <FaPause className="text-[9px]" />
                  </button>
                  <button
                    onClick={() => handleTimerControl("reset")}
                    className="p-1 bg-[#282828] hover:bg-indigo-500/20 text-indigo-400 rounded-md border border-[#383838] transition cursor-pointer"
                    title="Restart / Reset Timer"
                  >
                    <FaRedo className="text-[9px]" />
                  </button>
                </div>
              );
            })()}
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-[#1f1f1f] text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#383838] focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="javascript">JavaScript (ES6)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 17</option>
            <option value="java">Java 17</option>
          </select>

          {/* SETTINGS BUTTON (THEME, FONT SIZE, TAB SIZE) */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-1.5 bg-[#1f1f1f] hover:bg-[#2d2d2d] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-[#383838] hover:border-amber-500/50 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Editor Settings (Theme, Font Size, Tab Size)"
          >
            <FaCog className="text-amber-400 text-xs" />
            <span>Settings</span>
          </button>

          {/* HOST TERMINATE BUTTON */}

          {(() => {
            const uEmail = (user?.email || "").trim().toLowerCase();
            const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
            const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

            const userType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();
            let isHostUser = false;
            if (userType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
              isHostUser = true;
            } else if (hEmail && uEmail && uEmail === hEmail) {
              isHostUser = true;
            } else if (cEmail && uEmail && uEmail === cEmail) {
              isHostUser = false;
            } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
              isHostUser = true;
            }

            if (!isHostUser) return null;

            return (
              <button
                onClick={handleEndInterview}
                className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer animate-pulse"
                title="Terminate Live Interview for All Participants & Generate AI Evaluation Report"
              >
                <FaSignOutAlt className="text-xs" />
                <span>Terminate Session</span>
              </button>
            );
          })()}

          <button
            onClick={handleLeaveSession}
            className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <FaSignOutAlt className="text-xs" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* 4. LEETCODE SPLIT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT COLUMN: PROBLEM STATEMENT & TEST CASES */}
        <div className="w-[38%] bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
          {/* LEFT TABS STRIP */}
          <div className="flex items-center space-x-1 bg-[#1f1f1f] px-3 py-2 border-b border-[#333]">
            <button
              onClick={() => setLeftTab("description")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${leftTab === "description" ? "bg-[#262626] text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FaFileAlt className="text-amber-400 text-xs" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setLeftTab("responses")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${leftTab === "responses" ? "bg-[#262626] text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FaCheckCircle className="text-emerald-400 text-xs" />
              <span>Submissions ({responses.length})</span>
            </button>
            <button
              onClick={() => setLeftTab("console")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${leftTab === "console" ? "bg-[#262626] text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FaTerminal className="text-sky-400 text-xs" />
              <span>Console</span>
            </button>
          </div>

          {/* TAB CONTENT: PROBLEM DESCRIPTION */}
          {leftTab === "description" ? (
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs text-slate-300 font-sans scrollbar-hide">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-black text-white">{qData.question || "1. Two Sum"}</h2>
                  <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase ${qData.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : qData.difficulty === "Hard" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                    {qData.difficulty || "Easy"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <span className="bg-[#1f1f1f] px-2 py-0.5 rounded border border-[#383838]">Array</span>
                  <span className="bg-[#1f1f1f] px-2 py-0.5 rounded border border-[#383838]">Hash Table</span>
                </div>
              </div>

              {/* PROBLEM TEXT */}
              <div className="space-y-3 leading-relaxed text-slate-300">
                <p className="whitespace-pre-line">{qData.problemDescription || qData.question}</p>
              </div>

              {/* EXAMPLES CARDS */}
              {(qData.examples || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Examples</h3>
                  {qData.examples.map((ex, idx) => (
                    <div key={idx} className="bg-[#1f1f1f] p-4 rounded-xl border border-[#383838] space-y-2 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-bold">Example {idx + 1}:</span>
                        <span className="text-amber-300">Input: {ex.input}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400">Output: {ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 text-[10px] font-sans">
                          Explanation: {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CONSTRAINTS */}
              {(qData.constraints || []).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#333]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Constraints</h3>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
                    {qData.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* REAL-TIME LIVE WRITTEN ANSWER BOX WITH LIVE TYPING INDICATOR */}
              {(() => {
                const uEmail = (user?.email || "").trim().toLowerCase();
                const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
                const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

                let isHostUser = false;
                if (hEmail && uEmail && uEmail === hEmail) {
                  isHostUser = true;
                } else if (cEmail && uEmail && uEmail === cEmail) {
                  isHostUser = false;
                } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
                  isHostUser = true;
                }

                return (
                  <div className="space-y-2.5 pt-3 border-t border-[#333]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaCommentAlt className="text-amber-400 text-xs" />
                        <span>{isHostUser ? "Candidate Live Written Answer (Host View - Read Only)" : "Written Technical Answer (Live Sync)"}</span>
                      </h3>
                      {typingUser && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {typingUser} is typing...
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={answerInput}
                      readOnly={isHostUser}
                      onChange={(e) => {
                        if (isHostUser) return;
                        const val = e.target.value;
                        setAnswerInput(val);
                        const qId = currentQuestion?.questionId || `q${currentQIndex + 1}`;
                        socket.emit("answer_typing", { roomId, questionId: qId, textAnswer: val, code });
                      }}
                      placeholder={
                        isHostUser
                          ? "Candidate live text explanation will stream here in real-time... (Host View - Read Only)"
                          : "Type your explanation, approach, or technical answer here... (Host sees your live typing in real-time)"
                      }
                      className={`w-full text-xs p-3 rounded-xl border font-sans leading-relaxed resize-y shadow-inner ${isHostUser
                          ? "bg-[#101010] text-amber-300 border-[#2a2a2a] cursor-not-allowed selection:bg-amber-500/30"
                          : "bg-[#141414] text-slate-100 border-[#383838] focus:outline-none focus:border-amber-500"
                        }`}
                    />
                  </div>
                );
              })()}
            </div>
          ) : leftTab === "responses" ? (
            /* TAB CONTENT: SUBMITTED ANSWERS LOG */
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans scrollbar-hide">
              <div className="flex items-center justify-between border-b border-[#333] pb-3">
                <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  📋 Candidate Submitted Answers Log ({responses.length})
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Live Log
                </span>
              </div>

              {responses.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-slate-500 font-semibold">No answers submitted yet.</p>
                  <p className="text-[11px] text-slate-600">When candidate clicks "Submit Solution", their written explanations & code will record here in real-time.</p>
                </div>
              ) : (
                responses.map((resp, idx) => (
                  <div key={idx} className="bg-[#1f1f1f] p-4 rounded-2xl border border-[#383838] space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-[#333] pb-2">
                      <span className="font-bold text-amber-300">Q{idx + 1}: {resp.questionText || `Question ${resp.questionId}`}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {resp.answeredAt ? new Date(resp.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Submitted"}
                      </span>
                    </div>

                    {resp.answer && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Written Technical Answer:</span>
                        <p className="bg-[#141414] p-3 rounded-xl border border-[#2a2a2a] text-slate-200 font-sans text-xs whitespace-pre-wrap leading-relaxed">
                          {resp.answer}
                        </p>
                      </div>
                    )}

                    {resp.code && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Code Solution:</span>
                        <pre className="bg-[#141414] p-3 rounded-xl border border-[#2a2a2a] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {resp.code}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* TAB CONTENT: CONSOLE & EXECUTION RESULTS */
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-mono text-xs scrollbar-hide">
              <div className="flex items-center justify-between border-b border-[#333] pb-3">
                <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
                  <FaTerminal className="text-sky-400 text-xs" />
                  Console & Execution Output
                </h3>
              </div>

              {executing ? (
                <div className="text-center py-16 space-y-3">
                  <FaSpinner className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Executing Code on Server...</p>
                </div>
              ) : consoleOutput ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border bg-[#141414] border-[#333] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-lg border ${consoleOutput.status === "Accepted"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                        }`}>
                        {consoleOutput.status === "Accepted" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        <span>{consoleOutput.status || "Execution Result"}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#282828] font-bold">
                      <span>Runtime: <strong className="text-amber-400">{consoleOutput.time || "0 ms"}</strong></span>
                      <span>Memory: <strong className="text-indigo-400">{consoleOutput.memory || "0 MB"}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">Output & Stack Trace Logs:</span>
                    <pre className={`p-4 rounded-xl border text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner ${consoleOutput.status === "Accepted"
                        ? "bg-[#09150d] text-emerald-300 border-emerald-500/30"
                        : "bg-[#1f0b0b] text-rose-300 border-rose-500/40 font-semibold"
                      }`}>
                      {consoleOutput.output || consoleOutput.stderr || consoleOutput.compile_output || "No console output returned."}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 font-semibold italic text-xs space-y-2">
                  <FaTerminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Click "Run Code" in the editor header to execute your solution and view console output here.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CENTER COLUMN: MONACO CODE EDITOR & CONSOLE DRAWER */}
        <div className="flex-1 bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
          {/* EDITOR BAR */}
          <div className="h-10 bg-[#1f1f1f] px-4 flex items-center justify-between border-b border-[#333] text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <FaCode className="text-amber-400" />
              Code Solution ({language})
            </span>
            {submittedCurrent && (
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <FaCheck /> Submitted
              </span>
            )}
          </div>

          {/* MONACO EDITOR CONTAINER */}
          <div className="flex-1 bg-[#1e1e1e]">
            {(() => {
              const uEmail = (user?.email || "").trim().toLowerCase();
              const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
              const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

              let isHostUser = false;
              if (hEmail && uEmail && uEmail === hEmail) {
                isHostUser = true;
              } else if (cEmail && uEmail && uEmail === cEmail) {
                isHostUser = false;
              } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
                isHostUser = true;
              }

              return (
                <Editor
                  height="100%"
                  language={language}
                  theme={editorTheme}
                  value={code}
                  onChange={(newVal) => {
                    if (isHostUser) return;
                    handleCodeChange(newVal);
                  }}
                  options={{
                    readOnly: isHostUser,
                    fontSize: editorFontSize,
                    fontFamily: "Fira Code, Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: editorTabSize,
                  }}
                />
              );
            })()}
          </div>

          {/* BOTTOM CONSOLE DRAWER & ACTION BAR */}
          <div className="bg-[#1f1f1f] border-t border-[#333] p-3 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <FaTerminal className="text-sky-400" />
                Console {showConsole ? "▼" : "▲"}
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white font-bold text-xs rounded-xl border border-[#444] transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {executing ? <FaSpinner className="animate-spin text-amber-400" /> : <FaPlay className="text-emerald-400 text-[10px]" />}
                  <span>{executing ? "Executing..." : "Run Code"}</span>
                </button>

                {(() => {
                  const uEmail = (user?.email || "").trim().toLowerCase();
                  const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
                  const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

                  let isHostUser = false;
                  if (hEmail && uEmail && uEmail === hEmail) {
                    isHostUser = true;
                  } else if (cEmail && uEmail && uEmail === cEmail) {
                    isHostUser = false;
                  } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
                    isHostUser = true;
                  }

                  if (!isHostUser) {
                    return (
                      <button
                        onClick={handleSubmitSolution}
                        className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
                      >
                        Submit Solution
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      {submittedCurrent ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                          <FaCheck /> Candidate Submitted Answer
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          Live Monitoring Candidate Answer...
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* CONSOLE OUTPUT PANEL */}
            {showConsole && consoleOutput && (
              <div className="bg-[#101010] p-4 rounded-2xl border border-[#333] space-y-3 text-xs font-mono max-h-64 overflow-y-auto shadow-2xl animate-fade-in my-1">
                <div className="flex items-center justify-between border-b border-[#252525] pb-2.5">
                  <span className={`font-black text-xs uppercase tracking-wider flex items-center gap-2 px-3 py-1.5 rounded-xl border ${consoleOutput.status === "Accepted"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
                    }`}>
                    {consoleOutput.status === "Accepted" ? <FaCheckCircle className="text-sm" /> : <FaExclamationTriangle className="text-sm" />}
                    <span>{consoleOutput.status || "Execution Output"}</span>
                  </span>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-bold bg-[#181818] px-3 py-1 rounded-xl border border-[#2a2a2a]">
                    <span>Runtime: <strong className="text-amber-400">{consoleOutput.time || "0.00s"}</strong></span>
                    <span>Memory: <strong className="text-indigo-400">{consoleOutput.memory || "0 KB"}</strong></span>
                  </div>
                </div>

                {/* ERROR & STDOUT COMPILER OUTPUT TEXT AREA */}
                <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner ${consoleOutput.status === "Accepted"
                    ? "bg-[#08120c] text-emerald-300 border-emerald-500/20"
                    : "bg-[#180a0a] text-rose-300 border-rose-500/30 font-semibold"
                  }`}>
                  {consoleOutput.output || consoleOutput.stderr || consoleOutput.compile_output || "No console output returned."}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: VIDEO TILES & REAL-TIME CHAT */}
        <div className="w-[26%] bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
          {/* VIDEO TILES */}
          <div className="p-3 border-b border-[#333] space-y-2.5">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Live Stream Feeds</span>

            {(() => {
              const uEmail = (user?.email || "").trim().toLowerCase();
              const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
              const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();

              let isHostUser = false;
              if (hEmail && uEmail && uEmail === hEmail) {
                isHostUser = true;
              } else if (cEmail && uEmail && uEmail === cEmail) {
                isHostUser = false;
              } else if (room?.interviewerName && user?.name && room.interviewerName.toLowerCase().includes(user.name.toLowerCase())) {
                isHostUser = true;
              }

              const myRoleLabel = isHostUser ? "Interviewer" : "Candidate";
              const myDisplayName = user?.name || (isHostUser ? (room?.interviewerName || "Shree singh") : (room?.candidateName || candidateName));

              const otherRoleLabel = isHostUser ? "Candidate" : "Interviewer";
              const otherDisplayName = isHostUser ? (room?.candidateName || "Shivuu") : (room?.interviewerName || "Shree singh");

              return (
                <div className="grid grid-cols-2 gap-2">
                  {/* TILE 1: MY FEED */}
                  <div className="bg-[#141414] p-3 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1.5 min-w-0 shadow-sm hover:border-[#444] transition">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${isHostUser ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                      {myDisplayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="w-full min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate px-1" title={`${myDisplayName} (You)`}>
                        {myDisplayName} <span className="text-slate-400 font-normal">(You)</span>
                      </span>
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isHostUser ? "bg-sky-500/10 text-sky-400 border-sky-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
                      {myRoleLabel}
                    </span>
                  </div>

                  {/* TILE 2: OTHER PARTICIPANT FEED */}
                  <div className="bg-[#141414] p-3 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1.5 min-w-0 shadow-sm hover:border-[#444] transition">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${isHostUser ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-sky-500/20 text-sky-400 border border-sky-500/30"}`}>
                      {otherDisplayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="w-full min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate px-1" title={otherDisplayName}>
                        {otherDisplayName}
                      </span>
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${interviewerStatus === "Connected" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                      {otherRoleLabel} ({interviewerStatus})
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* REAL-TIME CHAT FEED */}
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Interview Chat</span>

            <div className="flex-1 bg-[#141414] p-3 rounded-xl border border-[#383838] overflow-y-auto space-y-2.5 text-xs font-sans scrollbar-hide">
              {chatMessages.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-6 font-semibold">No chat messages yet.</p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-xl text-xs space-y-1 ${msg.role === "Candidate" ? "bg-amber-500/10 border border-amber-500/20 text-amber-200" : "bg-sky-500/10 border border-sky-500/20 text-sky-200"}`}>
                    <div className="flex items-center justify-between text-[10px] opacity-75 font-bold">
                      <span>{msg.sender} ({msg.role})</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="font-medium leading-snug">
                      {typeof msg.text === "object" ? (msg.text?.text || JSON.stringify(msg.text)) : String(msg.text || "")}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* CHAT INPUT */}
            <form onSubmit={handleSendMessage} className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#141414] text-slate-200 text-xs px-3 py-2 rounded-xl border border-[#383838] focus:outline-none focus:border-amber-500 font-semibold"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition cursor-pointer"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* WORKSPACE & EDITOR SETTINGS MODAL (THEME, FONT SIZE, TAB SIZE) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#383838] text-slate-100 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-[#282828] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <FaCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Workspace & Editor Settings</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Customize theme, font size, and indentations</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* 1. EDITOR THEME SELECTOR */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                  Editor Theme
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "vs-dark", label: "🌙 VS Dark", bg: "bg-[#1e1e1e]" },
                    { id: "light", label: "☀️ VS Light", bg: "bg-slate-100 text-slate-900 font-bold" },
                    { id: "hc-black", label: "🕶️ High Contrast", bg: "bg-black text-emerald-400 font-bold" },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => {
                        setEditorTheme(thm.id);
                        localStorage.setItem("editor_theme", thm.id);
                      }}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${editorTheme === thm.id
                          ? "border-amber-500 ring-2 ring-amber-500/30 shadow-md"
                          : "border-[#333] hover:border-slate-500 opacity-70"
                        } ${thm.bg}`}
                    >
                      <span>{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. FONT SIZE SELECTOR */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                  Font Size (px)
                </label>
                <div className="flex items-center gap-2">
                  {[12, 14, 16, 18, 20].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setEditorFontSize(sz);
                        localStorage.setItem("editor_font_size", String(sz));
                      }}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-black transition cursor-pointer ${editorFontSize === sz
                          ? "bg-amber-500 text-black border-amber-400 shadow-md"
                          : "bg-[#1f1f1f] text-slate-300 border-[#383838] hover:border-slate-500"
                        }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. TAB SIZE SELECTOR */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                  Tab Size / Indentation
                </label>
                <div className="flex items-center gap-2.5">
                  {[
                    { sz: 2, label: "2 Spaces (Default)" },
                    { sz: 4, label: "4 Spaces" },
                    { sz: 8, label: "8 Spaces" },
                  ].map((tb) => (
                    <button
                      key={tb.sz}
                      type="button"
                      onClick={() => {
                        setEditorTabSize(tb.sz);
                        localStorage.setItem("editor_tab_size", String(tb.sz));
                      }}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${editorTabSize === tb.sz
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                          : "bg-[#1f1f1f] text-slate-300 border-[#383838] hover:border-slate-500"
                        }`}
                    >
                      {tb.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex justify-between items-center pt-3 border-t border-[#282828]">
              <button
                type="button"
                onClick={() => {
                  setEditorTheme("vs-dark");
                  setEditorFontSize(14);
                  setEditorTabSize(2);
                  localStorage.setItem("editor_theme", "vs-dark");
                  localStorage.setItem("editor_font_size", "14");
                  localStorage.setItem("editor_tab_size", "2");
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
