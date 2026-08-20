import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../../socket";
import { getLiveInterviewRoomById, submitAndEndInterview, runCodeInRoom } from "../../../services/liveInterviewService";
import {
  FaUserTie,
  FaClock,
  FaPlay,
  FaPause,
  FaRedo,
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
  FaLock,
  FaBookOpen,
  FaFileAlt,
  FaFlask,
  FaCommentAlt,
  FaUserGraduate,
  FaCog,
} from "react-icons/fa";

const LEETCODE_BANK = [
  {
    questionId: "leetcode_1",
    question: "1. Two Sum",
    difficulty: "Easy",
    type: "Coding",
    problemDescription: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    rubricHint: "Optimal Solution: Use a HashMap to store target - nums[i]. Time: O(N), Space: O(N)."
  },
  {
    questionId: "leetcode_146",
    question: "146. LRU Cache",
    difficulty: "Medium",
    type: "Coding",
    problemDescription: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class with `get(key)` and `put(key, value)` methods in O(1) average time complexity.",
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]', output: "[null, null, null, 1, null, -1]" }
    ],
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4"],
    rubricHint: "Optimal Solution: Combine a Doubly Linked List with a HashMap. Time: O(1), Space: O(capacity)."
  },
  {
    questionId: "leetcode_20",
    question: "20. Valid Parentheses",
    difficulty: "Easy",
    type: "Coding",
    problemDescription: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 10^4"],
    rubricHint: "Optimal Solution: Stack data structure. Time: O(N), Space: O(N)."
  }
];

export default function AdminInterviewRoomPage() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "ROOM_8F32K";
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateStatus, setCandidateStatus] = useState("Offline");
  const [interviewState, setInterviewState] = useState("waiting");

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [leftTab, setLeftTab] = useState("description"); // 'description' | 'rubric'
  const [mobileTab, setMobileTab] = useState("editor"); // 'problem' | 'editor' | 'chat' for screens < lg

  // Live Mirroring State
  const [candidateCode, setCandidateCode] = useState("// Candidate code stream will appear here in real-time...");
  const [candidateLang, setCandidateLang] = useState("javascript");
  const [responses, setResponses] = useState([]);

  // Timer Controls
  const [timerRemaining, setTimerRemaining] = useState(1800);

  // Chat Feed
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [finalResult, setFinalResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Remote Execution & Live Typing Monitor
  const [executing, setExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [candidateTextAnswer, setCandidateTextAnswer] = useState("");
  const [typingUser, setTypingUser] = useState("");

  // Workspace Editor Settings State (Theme, Font Size, Tab Size) & Console Toggle
  const [editorTheme, setEditorTheme] = useState(() => localStorage.getItem("editor_theme") || "vs-dark");
  const [editorFontSize, setEditorFontSize] = useState(() => Number(localStorage.getItem("editor_font_size")) || 14);
  const [editorTabSize, setEditorTabSize] = useState(() => Number(localStorage.getItem("editor_tab_size")) || 2);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConsole, setShowConsole] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          setInterviewState(res.room.status || "waiting");
          setTimerRemaining(res.room.timerRemaining || 1800);

          const qList = res.room.questions?.length > 0 ? res.room.questions : LEETCODE_BANK;
          setQuestions(qList);

          const restoredIdx = res.room.currentQuestionIndex || 0;
          setCurrentQIndex(restoredIdx);
          if (qList[restoredIdx]) {
            setCurrentQuestion(qList[restoredIdx]);
          }

          setResponses(res.room.responses || []);
          if (res.room.finalResult) setFinalResult(res.room.finalResult);
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

    socket.on("candidate_joined", (data) => setCandidateStatus(data.status || "Connected"));

    socket.on("interview_started", ({ room: r }) => {
      setInterviewState("active");
      if (r) setRoom(r);
    });

    socket.on("code_changed", (data) => {
      if (data && data.code !== undefined) setCandidateCode(data.code);
      if (data && data.candidateName) setTypingUser(data.candidateName);
    });

    socket.on("answer_typing", (data) => {
      if (!data) return;
      if (data.textAnswer !== undefined) setCandidateTextAnswer(data.textAnswer);
      if (data.code !== undefined && data.code !== "") setCandidateCode(data.code);
      if (data.candidateName) setTypingUser(data.candidateName);
    });

    socket.on("typing_indicator", (data) => {
      if (data && data.userName) setTypingUser(data.userName);
    });

    socket.on("language_updated", ({ language }) => setCandidateLang(language));

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

    socket.on("timer_tick", ({ timerRemaining: newTime }) => setTimerRemaining(newTime));
    socket.on("timer_paused", ({ timerRemaining: newTime }) => {
      if (newTime !== undefined) setTimerRemaining(newTime);
      setInterviewState("waiting");
    });
    socket.on("timer_resumed", ({ timerRemaining: newTime }) => {
      if (newTime !== undefined) setTimerRemaining(newTime);
      setInterviewState("active");
    });

    socket.on("receive_message", (msg) => setChatMessages((prev) => [...prev, msg]));

    socket.on("interview_ended", ({ room: r, finalResult: fr }) => {
      setInterviewState("completed");
      if (r) setRoom(r);
      if (fr) setFinalResult(fr);
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("interview_started");
      socket.off("code_changed");
      socket.off("answer_typing");
      socket.off("language_updated");
      socket.off("answer_submitted");
      socket.off("timer_tick");
      socket.off("timer_paused");
      socket.off("timer_resumed");
      socket.off("receive_message");
      socket.off("interview_ended");
    };
  }, [roomId]);

  const handleStartInterview = () => {
    setInterviewState("active");
    socket.emit("start_interview", { roomId });
  };

  const handleTimerControl = (action) => {
    socket.emit("timer_control", { roomId, action });
  };

  const handleSwapProblem = (probObj) => {
    setCurrentQuestion(probObj);
    socket.emit("send_question", {
      roomId,
      questionId: probObj.questionId,
      question: probObj.question,
      difficulty: probObj.difficulty,
      problemDescription: probObj.problemDescription,
      examples: probObj.examples,
      constraints: probObj.constraints,
      type: "Coding",
      order: currentQIndex + 1,
    });
  };

  const handleRunCandidateCode = async () => {
    try {
      setExecuting(true);
      const res = await runCodeInRoom(roomId, {
        code: candidateCode,
        language: candidateLang,
        input: currentQuestion?.examples?.[0]?.input || "",
      });
      if (res.success) {
        setConsoleOutput({
          status: res.status || "Accepted",
          output: res.output || res.stdout || "Execution clean.",
          time: res.time || "42 ms",
          memory: res.memory || "40.8 MB",
        });
      }
    } catch (err) {
      setConsoleOutput({
        status: "Compile Error",
        output: err.message || "Error running code.",
        time: "0 ms",
        memory: "0 MB",
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleEndInterview = async () => {
    socket.emit("end_interview", { roomId });
    try {
      const res = await submitAndEndInterview(roomId, {});
      if (res.finalResult) setFinalResult(res.finalResult);
    } catch (err) {
      console.error("End interview error:", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msgObj = {
      sender: "Rahul (Admin)",
      role: "Interviewer",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, msgObj]);
    socket.emit("send_message", { roomId, message: msgObj });
    setChatInput("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading LeetCode Admin Control Room...</p>
      </div>
    );
  }

  const qObj = currentQuestion || LEETCODE_BANK[0];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER TOOLBAR */}
      <header className="min-h-[3.25rem] bg-[#262626] border-b border-[#333] px-3 sm:px-5 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 shrink-0 z-50">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shrink-0">
              <FaUserTie />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white whitespace-nowrap">
              LeetCode Admin <span className="text-indigo-400">Live Control</span>
            </span>
          </div>

          <span className="text-[11px] sm:text-xs font-mono font-bold text-indigo-400 bg-[#1f1f1f] px-2.5 py-1 rounded-lg border border-[#383838] whitespace-nowrap">
            {roomId}
          </span>
        </div>

        {/* TIMER & SESSION CONTROLS */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 ml-auto">
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-[#1f1f1f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#383838] shrink-0">
            <FaClock className="text-amber-400 text-xs animate-pulse" />
            <span className="font-mono text-xs font-bold text-white whitespace-nowrap">{formatTime(timerRemaining)}</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => handleTimerControl("start")}
              className="p-1.5 sm:p-2 bg-[#1f1f1f] hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Start / Resume Timer"
            >
              <FaPlay className="text-xs" />
            </button>
            <button
              onClick={() => handleTimerControl("pause")}
              className="p-1.5 sm:p-2 bg-[#1f1f1f] hover:bg-amber-500/20 text-amber-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Pause Timer"
            >
              <FaPause className="text-xs" />
            </button>
            <button
              onClick={() => handleTimerControl("reset")}
              className="p-1.5 sm:p-2 bg-[#1f1f1f] hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Reset Timer"
            >
              <FaRedo className="text-xs" />
            </button>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#1f1f1f] hover:bg-[#2d2d2d] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-[#383838] hover:border-indigo-500/50 transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
            title="Editor Settings (Theme, Font Size, Tab Size)"
          >
            <FaCog className="text-indigo-400 text-xs" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={handleEndInterview}
            className="px-3 sm:px-4 py-1 sm:py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer shrink-0 whitespace-nowrap"
          >
            END SESSION
          </button>
        </div>
      </header>

      {/* PROBLEM SWAPPER & STEPPER STRIP */}
      <div className="bg-[#1f1f1f] border-b border-[#333] px-3 sm:px-5 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide shrink-0">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider mr-1 sm:mr-2 whitespace-nowrap">Bank:</span>
          {LEETCODE_BANK.map((pb) => (
            <button
              key={pb.questionId}
              onClick={() => handleSwapProblem(pb)}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${qObj.questionId === pb.questionId ? "bg-indigo-600 text-white shadow-md" : "bg-[#262626] text-slate-400 hover:text-white border border-[#383838]"}`}
            >
              <FaCode className="text-[10px] text-indigo-400" />
              <span>{pb.question}</span>
            </button>
          ))}
        </div>

        <button
          onClick={copyRoomId}
          className="px-3 py-1 bg-[#262626] hover:bg-[#333] text-slate-300 font-bold text-xs rounded-xl border border-[#383838] transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <FaCopy className="text-[10px] text-indigo-400" />
          <span>{copied ? "Copied Link ✓" : "Copy Link"}</span>
        </button>
      </div>

      {/* MOBILE SECTION NAVIGATION TABS (Visible on screens < lg) */}
      <div className="flex lg:hidden bg-[#1f1f1f] px-2 py-1.5 border-b border-[#333] items-center justify-around text-xs shrink-0 font-bold">
        <button
          onClick={() => setMobileTab("problem")}
          className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${mobileTab === "problem" ? "bg-indigo-600 text-white shadow-md font-black" : "text-slate-400 hover:text-white"}`}
        >
          <FaFileAlt className="text-xs" />
          <span>Problem</span>
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${mobileTab === "editor" ? "bg-indigo-600 text-white shadow-md font-black" : "text-slate-400 hover:text-white"}`}
        >
          <FaCode className="text-xs" />
          <span>Candidate Code</span>
        </button>
        <button
          onClick={() => setMobileTab("chat")}
          className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${mobileTab === "chat" ? "bg-indigo-600 text-white shadow-md font-black" : "text-slate-400 hover:text-white"}`}
        >
          <FaUserGraduate className="text-xs" />
          <span>Feeds & Chat</span>
        </button>
      </div>

      {/* MAIN ADMIN WORKSPACE SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-1.5 sm:p-2 gap-2 min-h-0">
        {/* LEFT COLUMN: PROBLEM STATEMENT & INTERVIEWER RUBRIC */}
        <div className={`lg:w-[32%] xl:w-[35%] w-full bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden ${mobileTab === "problem" ? "flex flex-1" : "hidden lg:flex"}`}>
          <div className="flex items-center space-x-1 bg-[#1f1f1f] px-3 py-2 border-b border-[#333]">
            <button
              onClick={() => setLeftTab("description")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${leftTab === "description" ? "bg-[#262626] text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FaFileAlt className="text-indigo-400 text-xs" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setLeftTab("rubric")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${leftTab === "rubric" ? "bg-[#262626] text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FaBookOpen className="text-amber-400 text-xs" />
              <span>Interviewer Rubric</span>
            </button>
          </div>

          {leftTab === "description" ? (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans scrollbar-hide">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white">{qObj.question}</h2>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {qObj.difficulty}
                </span>
              </div>
              <p className="whitespace-pre-line text-slate-300 leading-relaxed">{qObj.problemDescription}</p>

              {(qObj.examples || []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase">Examples</h3>
                  {qObj.examples.map((ex, i) => (
                    <div key={i} className="bg-[#1f1f1f] p-3 rounded-xl border border-[#383838] font-mono text-[11px]">
                      <div>Input: <span className="text-amber-300">{ex.input}</span></div>
                      <div>Output: <span className="text-emerald-400">{ex.output}</span></div>
                    </div>
                  ))}
                </div>
              )}

              {/* REAL-TIME CANDIDATE WRITTEN TEXT ANSWER MONITOR */}
              <div className="space-y-2 pt-3 border-t border-[#333]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FaCommentAlt className="text-amber-400 text-xs" />
                    <span>Candidate Live Written Answer (Real-Time)</span>
                  </h3>
                  {typingUser && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {typingUser} is writing answer...
                    </span>
                  )}
                </div>
                <div className="w-full bg-[#141414] text-slate-100 text-xs p-3 rounded-xl border border-[#383838] font-sans leading-relaxed min-h-[90px] max-h-[140px] overflow-y-auto whitespace-pre-wrap shadow-inner">
                  {candidateTextAnswer ? (
                    <span className="text-amber-200 font-medium">{candidateTextAnswer}</span>
                  ) : (
                    <span className="text-slate-500 italic font-medium">Waiting for candidate to write text explanation... (Characters stream live here in real-time)</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans scrollbar-hide">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">Secret Interviewer Rubric & Solution</h3>
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-[#383838] space-y-3 font-mono text-[11px]">
                <p className="text-slate-300 leading-relaxed font-sans">{qObj.rubricHint}</p>
                <div className="pt-2 border-t border-[#333] text-emerald-400">
                  Time Complexity: O(N) | Space Complexity: O(N)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: LIVE CANDIDATE MONACO MIRROR */}
        <div className={`flex-1 min-w-0 bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden ${mobileTab === "editor" ? "flex flex-1" : "hidden lg:flex"}`}>
          <div className="min-h-[2.5rem] bg-[#1f1f1f] px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#333] text-xs font-bold text-slate-300 shrink-0">
            <span className="flex items-center gap-2 truncate">
              <FaCode className="text-indigo-400 shrink-0" />
              <span className="truncate">Live Candidate Code Stream ({candidateLang})</span>
            </span>

            <div className="flex items-center flex-wrap gap-2 ml-auto">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  showConsole ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "bg-[#282828] text-slate-400 border-[#383838]"
                }`}
                title="Toggle Console Side Panel"
              >
                <FaTerminal className="text-indigo-400 text-xs" />
                <span>Console {showConsole ? "▶" : "◀"}</span>
              </button>

              <button
                onClick={handleRunCandidateCode}
                disabled={executing}
                className="px-3 sm:px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                {executing ? <FaSpinner className="animate-spin text-amber-400" /> : <FaPlay className="text-xs" />}
                <span>{executing ? "Running..." : "Run Code"}</span>
              </button>

              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Mirroring
              </span>
            </div>
          </div>

          {/* EDITOR & CONSOLE FLEX CONTAINER */}
          <div className="flex-1 flex overflow-hidden relative min-h-[250px]">
            <div className="flex-1 bg-[#1e1e1e] h-full min-w-0">
              <Editor
                height="100%"
                language={candidateLang}
                theme={editorTheme}
                value={candidateCode}
                options={{
                  readOnly: true,
                  fontSize: editorFontSize,
                  fontFamily: "Fira Code, Consolas, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: editorTabSize,
                }}
              />
            </div>

            {/* RIGHT SIDE CONSOLE OUTPUT PANEL */}
            {showConsole && (
              <div className="w-80 md:w-96 bg-[#111111] border-l border-[#333] flex flex-col h-full z-20 shadow-2xl animate-fade-in shrink-0">
                <div className="p-3 bg-[#181818] border-b border-[#282828] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <FaTerminal className="text-indigo-400 text-xs" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">Candidate Remote Console</span>
                  </div>
                  <button
                    onClick={() => setShowConsole(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs scrollbar-hide">
                  {executing ? (
                    <div className="text-center py-20 space-y-3">
                      <FaSpinner className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                      <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Executing Candidate Code...</p>
                    </div>
                  ) : consoleOutput ? (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl border bg-[#161616] border-[#2d2d2d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                            consoleOutput.status === "Accepted"
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

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase text-slate-400 block">Output & Error Logs:</span>
                        <pre className={`p-4 rounded-xl border text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner ${
                          consoleOutput.status === "Accepted"
                            ? "bg-[#08130d] text-emerald-300 border-emerald-500/30"
                            : "bg-[#1d0b0b] text-rose-300 border-rose-500/40 font-semibold"
                        }`}>
                          {consoleOutput.output || consoleOutput.stderr || consoleOutput.compile_output || "No console output returned."}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-500 font-semibold italic text-xs space-y-2">
                      <FaTerminal className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>Click "Run Candidate Code" to test execution output here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: VIDEO TILES & INTERVIEWER CHAT */}
        <div className={`lg:w-[28%] xl:w-[25%] w-full bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden ${mobileTab === "chat" ? "flex flex-1" : "hidden lg:flex"}`}>
          <div className="p-2.5 sm:p-3 border-b border-[#333] space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Participant Streams</span>
            <div className="grid grid-cols-2 gap-2 min-w-0">
              <div className="bg-[#141414] p-2 sm:p-2.5 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1 min-w-0 overflow-hidden shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-xs shrink-0">
                  <FaUserGraduate />
                </div>
                <div className="w-full min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-white block truncate px-0.5" title={room?.candidateName || "Candidate"}>
                    {room?.candidateName || "Candidate"}
                  </span>
                </div>
                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border max-w-full truncate block whitespace-nowrap ${candidateStatus === "Connected" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                  {candidateStatus}
                </span>
              </div>

              <div className="bg-[#141414] p-2 sm:p-2.5 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1 min-w-0 overflow-hidden shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs shrink-0">
                  <FaUserTie />
                </div>
                <div className="w-full min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-white block truncate px-0.5" title="Rahul (Admin)">
                    Rahul (Admin)
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 max-w-full truncate block whitespace-nowrap">
                  Host
                </span>
              </div>
            </div>
          </div>

          {/* CHAT CONSOLE */}
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">Interviewer Chat</span>
            <div className="flex-1 bg-[#141414] p-3 rounded-xl border border-[#383838] overflow-y-auto space-y-2.5 text-xs font-sans scrollbar-hide">
              {chatMessages.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-6 font-semibold">No messages exchanged yet.</p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-xl text-xs space-y-1 ${msg.role === "Interviewer" ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-200" : "bg-amber-500/10 border border-amber-500/20 text-amber-200"}`}>
                    <div className="flex items-center justify-between text-[10px] opacity-75 font-bold">
                      <span>{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="font-medium leading-snug">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#141414] text-slate-200 text-xs px-3 py-2 rounded-xl border border-[#383838] focus:outline-none focus:border-indigo-500 font-semibold"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition cursor-pointer"
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
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
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
                <label className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
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
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        editorTheme === thm.id
                          ? "border-indigo-500 ring-2 ring-indigo-500/30 shadow-md"
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
                <label className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
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
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-black transition cursor-pointer ${
                        editorFontSize === sz
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
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
                <label className="text-[11px] font-black uppercase text-indigo-400 tracking-wider block">
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
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        editorTabSize === tb.sz
                          ? "bg-purple-600 text-white border-purple-400 shadow-md"
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
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
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
