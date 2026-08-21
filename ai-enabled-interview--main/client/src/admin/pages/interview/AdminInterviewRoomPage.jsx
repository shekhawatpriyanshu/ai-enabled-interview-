import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../../socket";
import {
  getLiveInterviewRoomById,
  submitAndEndInterview,
  runCodeInRoom,
} from "../../../services/liveInterviewService";
import {
  FaClock,
  FaPlay,
  FaPause,
  FaRedo,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
  FaCopy,
  FaCode,
  FaTerminal,
  FaBookOpen,
  FaFileAlt,
  FaCommentAlt,
  FaCog,
  FaTimes,
  FaCheck,
  FaCaretDown,
  FaCaretUp,
  FaSignOutAlt,
  FaListUl,
} from "react-icons/fa";

const LEETCODE_BANK = [
  {
    questionId: "leetcode_1",
    question: "Explain the difference between JWT authentication and session authentication.",
    difficulty: "Medium",
    type: "Technical",
    tags: ["Authentication", "Security", "Web Dev"],
    problemDescription:
      "Explain the difference between JWT (JSON Web Token) authentication and traditional Session-based authentication.\n\nDiscuss memory storage, scalability, security vulnerabilities (CSRF vs XSS), payload inspection, and token revocation strategies.",
    examples: [
      {
        input: "JWT Flow",
        output: "Stateless. Token stored on client (localStorage/cookie), verified via signature.",
        explanation: "No server-side database session lookup required per request.",
      },
      {
        input: "Session Flow",
        output: "Stateful. Session ID stored in cookie, session data kept in server memory / Redis.",
        explanation: "Requires server storage check on every incoming API request.",
      },
    ],
    constraints: ["Explain Time & Space Overhead", "Security Best Practices"],
    rubricHint:
      "Candidate should mention: 1. Stateful vs Stateless 2. Scalability benefits of JWT 3. Token revocation difficulty in JWT 4. Security (HttpOnly cookies vs LocalStorage).",
  },
  {
    questionId: "leetcode_146",
    question: "146. LRU Cache",
    difficulty: "Medium",
    type: "Coding",
    tags: ["Hash Table", "Linked List", "Design"],
    problemDescription:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class with `get(key)` and `put(key, value)` methods in O(1) average time complexity.",
    examples: [
      {
        input: '["LRUCache", "put", "put", "get"]\n[[2], [1, 1], [2, 2], [1]]',
        output: "[null, null, null, 1]",
        explanation: "Cache holds up to 2 items.",
      },
    ],
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4"],
    rubricHint:
      "Optimal Solution: Combine a Doubly Linked List with a HashMap. Time: O(1), Space: O(capacity).",
  },
  {
    questionId: "leetcode_20",
    question: "1. Two Sum",
    difficulty: "Easy",
    type: "Coding",
    tags: ["Array", "Hash Table"],
    problemDescription:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    rubricHint:
      "Optimal Solution: Use a HashMap to store target - nums[i]. Time: O(N), Space: O(N).",
  },
];

export default function AdminInterviewRoomPage() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "ROOM_ZU09W";
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Participant Connection Telemetry
  const [candidateStatus, setCandidateStatus] = useState("Connected");
  // eslint-disable-next-line no-unused-vars
  const [hostStatus, setHostStatus] = useState("Connected");

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [leftTab, setLeftTab] = useState("description"); // 'description' | 'rubric'

  // Live Mirroring State
  const [candidateCode, setCandidateCode] = useState(
    `/**\n * Write your JavaScript code solution below\n */\nfunction solution() {\n    // TODO: Write your code implementation here\n    console.log("Solution executed successfully.");\n    return true;\n}\n\nsolution();`
  );
  const [candidateLang, setCandidateLang] = useState("javascript");
  const [candidateTextAnswer, setCandidateTextAnswer] = useState("");
  const [typingUser, setTypingUser] = useState("");

  // Timer & Session Duration
  const [timerRemaining, setTimerRemaining] = useState(1605); // 26:45 default
  // eslint-disable-next-line no-unused-vars
  const [sessionState, setSessionState] = useState("Active"); // "Active" | "Paused" | "Completed"

  // Live Activity Audit Log (Timeline of Host & Candidate actions)
  const [activityLogs, setActivityLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Chat Feed
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [copied, setCopied] = useState(false);

  // Remote Execution Console State
  const [executing, setExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [showConsole, setShowConsole] = useState(false);

  // Workspace Editor Settings
  const [editorTheme, setEditorTheme] = useState(
    () => localStorage.getItem("editor_theme") || "vs-dark"
  );
  // eslint-disable-next-line no-unused-vars
  const [editorFontSize, setEditorFontSize] = useState(
    () => Number(localStorage.getItem("editor_font_size")) || 14
  );
  // eslint-disable-next-line no-unused-vars
  const [editorTabSize, setEditorTabSize] = useState(
    () => Number(localStorage.getItem("editor_tab_size")) || 2
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProblemBankModal, setShowProblemBankModal] = useState(false);

  // Helper to append timestamped activity event
  const addActivityLog = (actor, role, actionText, type = "info") => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const logItem = {
      id: Date.now() + Math.random(),
      actor,
      role,
      actionText,
      type,
      timestamp: timeStr,
    };
    setActivityLogs((prev) => [...prev.slice(-99), logItem]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activityLogs]);

  // Load Room Metadata
  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoom(res.room);
          const initialTime = res.room.duration ? res.room.duration * 60 : 1605;
          setTimerRemaining(initialTime);

          const qList =
            res.room.questions?.length > 0 ? res.room.questions : LEETCODE_BANK;
          const restoredIdx = res.room.currentQuestionIndex || 0;
          setCurrentQIndex(restoredIdx);
          if (qList[restoredIdx]) {
            setCurrentQuestion(qList[restoredIdx]);
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

  // Socket Subscriptions
  useEffect(() => {
    socket.emit("join_room", { roomId, role: "Admin", userName: "Admin Supervisor" });

    socket.on("candidate_joined", (data) => {
      const statusStr = data?.status || "Connected";
      setCandidateStatus(statusStr);
      addActivityLog(
        data?.candidateName || "Candidate",
        "Candidate",
        `Candidate joined session (${statusStr})`,
        "connection"
      );
    });

    socket.on("candidate_left", () => {
      setCandidateStatus("Disconnected");
      addActivityLog("Candidate", "Candidate", "Candidate disconnected from room", "connection");
    });

    socket.on("interviewer_joined", (data) => {
      setHostStatus("Connected");
      addActivityLog(
        data?.userName || "Host",
        "Host",
        "Interviewer Host connected to session",
        "connection"
      );
    });

    socket.on("interviewer_left", () => {
      setHostStatus("Disconnected");
      addActivityLog("Host", "Host", "Interviewer Host disconnected", "connection");
    });

    socket.on("interview_started", ({ room: r }) => {
      setSessionState("Active");
      if (r) setRoom(r);
      addActivityLog("Host", "Host", "Started live interview session", "timer");
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

    socket.on("language_updated", ({ language }) => {
      setCandidateLang(language);
      addActivityLog("Candidate", "Candidate", `Switched editor language to ${language.toUpperCase()}`, "code");
    });

    socket.on("timer_tick", ({ timerRemaining: newTime }) => setTimerRemaining(newTime));

    socket.on("timer_paused", ({ timerRemaining: newTime }) => {
      if (newTime !== undefined) setTimerRemaining(newTime);
      setSessionState("Paused");
      addActivityLog("Host", "Host", "Paused session timer", "timer");
    });

    socket.on("timer_resumed", ({ timerRemaining: newTime }) => {
      if (newTime !== undefined) setTimerRemaining(newTime);
      setSessionState("Active");
      addActivityLog("Host", "Host", "Resumed session timer", "timer");
    });

    socket.on("receive_message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      addActivityLog(msg.sender || "User", msg.role || "Participant", `Sent message: "${msg.text}"`, "chat");
    });

    socket.on("question_swapped", ({ question }) => {
      if (question) {
        setCurrentQuestion(question);
        addActivityLog("Host", "Host", `Pushed question: ${question.question || "Problem"}`, "question");
      }
    });

    socket.on("interview_ended", ({ room: r }) => {
      setSessionState("Completed");
      if (r) setRoom(r);
      addActivityLog("System", "System", "Interview session ended", "timer");
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("candidate_left");
      socket.off("interviewer_joined");
      socket.off("interviewer_left");
      socket.off("interview_started");
      socket.off("code_changed");
      socket.off("answer_typing");
      socket.off("typing_indicator");
      socket.off("language_updated");
      socket.off("timer_tick");
      socket.off("timer_paused");
      socket.off("timer_resumed");
      socket.off("receive_message");
      socket.off("question_swapped");
      socket.off("interview_ended");
    };
  }, [roomId]);

  const handleTimerControl = (action) => {
    socket.emit("timer_control", { roomId, action });
    addActivityLog("Supervisor Admin", "Admin", `Timer control: ${action.toUpperCase()}`, "timer");
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
      type: probObj.type || "Coding",
      order: currentQIndex + 1,
    });
    setShowProblemBankModal(false);
    addActivityLog("Supervisor Admin", "Admin", `Swapped active problem to ${probObj.question}`, "question");
  };

  const handleRunCandidateCode = async () => {
    try {
      setExecuting(true);
      setShowConsole(true);
      addActivityLog("Supervisor Admin", "Admin", "Initiated remote code run", "execution");
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
        addActivityLog("System", "Execution", `Code test result: ${res.status || "Accepted"}`, "execution");
      }
    } catch (err) {
      setConsoleOutput({
        status: "Compile Error",
        output: err.message || "Error running candidate code.",
        time: "0 ms",
        memory: "0 MB",
      });
      addActivityLog("System", "Execution", `Code test failed: ${err.message}`, "execution");
    } finally {
      setExecuting(false);
    }
  };

  const handleEndInterview = async () => {
    if (!window.confirm("Are you sure you want to terminate this live interview session for all participants?")) {
      return;
    }
    socket.emit("end_interview", { roomId });
    addActivityLog("Supervisor Admin", "Admin", "Terminated room session", "system");
    try {
      await submitAndEndInterview(roomId, {});
    } catch (err) {
      console.error("End interview error:", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msgObj = {
      sender: "Rahul (Admin)",
      role: "Admin",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#111111] text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#ffa116]/30 border-t-[#ffa116] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading LeetCode Live Interview Console...
        </p>
      </div>
    );
  }

  const qObj = currentQuestion || LEETCODE_BANK[0];
  const candidateName = room?.candidateName || "Shivuu";
  const interviewerName = room?.interviewerName || "Shree singh";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER TOOLBAR */}
      <header className="h-14 bg-[#262626] border-b border-[#333] px-5 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              <FaUserTie />
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              LeetCode Admin <span className="text-indigo-400">Live Control</span>
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-indigo-400 bg-[#1f1f1f] px-3 py-1 rounded-lg border border-[#383838]">
            {roomId}
          </span>
        </div>

        {/* TIMER & SESSION CONTROLS */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#383838]">
            <FaClock className="text-amber-400 text-xs animate-pulse" />
            <span className="font-mono text-xs font-bold text-white">{formatTime(timerRemaining)}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleTimerControl("start")}
              className="p-2 bg-[#1f1f1f] hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Start / Resume Timer"
            >
              <FaPlay className="text-[9px]" />
            </button>
            <button
              onClick={() => handleTimerControl("pause")}
              className="p-2 bg-[#1f1f1f] hover:bg-amber-500/20 text-amber-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Pause Timer"
            >
              <FaPause className="text-[9px]" />
            </button>
            <button
              onClick={() => handleTimerControl("reset")}
              className="p-2 bg-[#1f1f1f] hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-[#383838] transition cursor-pointer"
              title="Reset Timer"
            >
              <FaRedo className="text-[9px]" />
            </button>
          </div>

          {/* Language Selector Dropdown Pill */}
          <div className="bg-[#262626] text-slate-200 text-[11px] font-semibold px-2 py-1 rounded-lg border border-[#383838] flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>JS (ES6)</span>
            <FaCaretDown className="text-slate-400 text-[10px]" />
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-1.5 bg-[#1f1f1f] hover:bg-[#2d2d2d] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-[#383838] hover:border-indigo-500/50 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Editor Settings (Theme, Font Size, Tab Size)"
          >
            <FaCog className="text-indigo-400 text-xs" />
            <span>Settings</span>
          </button>

          {/* TERMINATE SESSION BUTTON */}
          <button
            onClick={handleEndInterview}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer"
          >
            <FaTimes className="text-[9px]" />
            <span>End Session</span>
          </button>
        </div>
      </header>

      {/* PROBLEM SWAPPER & STEPPER STRIP */}
      <div className="bg-[#1f1f1f] border-b border-[#333] px-5 py-2 flex items-center justify-between overflow-x-auto scrollbar-hide">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider mr-2">LeetCode Bank:</span>
          {LEETCODE_BANK.map((pb) => (
            <button
              key={pb.questionId}
              onClick={() => handleSwapProblem(pb)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${qObj.questionId === pb.questionId ? "bg-indigo-600 text-white shadow-md" : "bg-[#262626] text-slate-400 hover:text-white border border-[#383838]"}`}
            >
              <FaCode className="text-[10px] text-indigo-400" />
              <span>{pb.question}</span>
            </button>
          ))}
        </div>

        <button
          onClick={copyRoomId}
          className="px-3.5 py-1 bg-[#262626] hover:bg-[#333] text-slate-300 font-bold text-xs rounded-xl border border-[#383838] transition flex items-center gap-1.5 cursor-pointer"
        >
          <FaCopy className="text-[10px] text-indigo-400" />
          <span>{copied ? "Copied Link ✓" : "Copy Link"}</span>
        </button>
      </div>

      {/* MAIN ADMIN WORKSPACE SPLIT */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT COLUMN: PROBLEM STATEMENT & INTERVIEWER RUBRIC */}
        <div className="w-[35%] bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
          <div className="flex items-center space-x-1 bg-[#1f1f1f] px-3 py-2 border-b border-[#333]">
            <button
              onClick={() => setLeftTab("submissions")}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${leftTab === "submissions"
                  ? "bg-[#262626] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <FaCheckCircle className="text-emerald-400 text-xs" />
              <span>Submissions (0)</span>
            </button>

            <button
              onClick={() => setLeftTab("console")}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${leftTab === "console"
                  ? "bg-[#262626] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <FaTerminal className="text-sky-400 text-xs" />
              <span>Console</span>
            </button>
          </div>

          {/* Left Tab Content */}
          {leftTab === "description" ? (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans leading-relaxed scrollbar-hide">
              {/* Question Title & Difficulty Tag */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight">
                    {qObj.question}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ffa116]/15 text-[#ffa116] border border-[#ffa116]/30 shrink-0 whitespace-nowrap">
                    {qObj.difficulty || "MEDIUM"}
                  </span>
                </div>

                {/* Topic Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(qObj.tags || ["Array", "Hash Table"]).map((tg, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#262626] text-slate-300 border border-[#383838]"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem Description */}
              <p className="whitespace-pre-line text-slate-300 leading-relaxed text-xs">
                {qObj.problemDescription}
              </p>

              {/* Examples */}
              {(qObj.examples || []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Examples
                  </h3>
                  {qObj.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-[#141414] p-3 rounded-xl border border-[#282828] font-mono text-[11px] space-y-1 shadow-xs"
                    >
                      <div>
                        Input: <span className="text-amber-300">{ex.input}</span>
                      </div>
                      <div>
                        Output:{" "}
                        <span className="text-emerald-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-[10px] text-slate-400 font-sans pt-1 border-t border-[#282828]">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CANDIDATE LIVE WRITTEN ANSWER STREAM CONTAINER */}
              <div className="space-y-2 pt-3 border-t border-[#282828]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-extrabold uppercase text-[#ffa116] tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    <FaCommentAlt className="text-[#ffa116] text-xs" />
                    <span>CANDIDATE LIVE WRITTEN ANSWER</span>
                  </h3>
                  {typingUser && (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse whitespace-nowrap">
                      typing...
                    </span>
                  )}
                </div>
                <div className="w-full bg-[#141414] text-slate-300 text-xs p-3 rounded-xl border border-[#282828] font-sans leading-relaxed min-h-[90px] max-h-[150px] overflow-y-auto whitespace-pre-wrap shadow-inner border-indigo-500/20">
                  {candidateTextAnswer ? (
                    <span className="text-amber-200 font-medium">
                      {candidateTextAnswer}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic font-medium">
                      Candidate live text explanation will stream here in real-time... (Host View - Read Only)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : leftTab === "submissions" ? (
            <div className="flex-1 p-6 text-center text-slate-500 font-medium text-xs space-y-2">
              <FaCheckCircle className="text-2xl text-slate-600 mx-auto mb-2" />
              <p>No candidate submissions submitted yet for this problem.</p>
            </div>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono space-y-3 scrollbar-hide">
              <h3 className="text-xs font-black uppercase text-[#ffa116] tracking-wider">
                Interviewer Rubric & Execution Notes
              </h3>
              <div className="bg-[#141414] p-3.5 rounded-xl border border-[#282828] space-y-2">
                <p className="text-slate-300 font-sans leading-relaxed">{qObj.rubricHint}</p>
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: LIVE CANDIDATE MONACO MIRROR */}
        <div className="flex-1 bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
          <div className="h-10 bg-[#1f1f1f] px-4 flex items-center justify-between border-b border-[#333] text-xs font-bold text-slate-300 shrink-0">
            <span className="flex items-center gap-2">
              <FaCode className="text-indigo-400" />
              Live Candidate Code Stream ({candidateLang})
            </span>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${showConsole ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "bg-[#282828] text-slate-400 border-[#383838]"
                  }`}
                title="Toggle Console Side Panel"
              >
                <FaTerminal className="text-indigo-400 text-xs" />
                <span>Console Output {showConsole ? "▶" : "◀"}</span>
              </button>

              <button
                onClick={handleRunCandidateCode}
                disabled={executing}
                className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {executing ? <FaSpinner className="animate-spin text-amber-400" /> : <FaPlay className="text-xs" />}
                <span>{executing ? "Running..." : "Run Candidate Code"}</span>
              </button>

              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Mirroring
              </span>
            </div>
          </div>

          {/* EDITOR & CONSOLE FLEX CONTAINER */}
          <div className="flex-1 flex overflow-hidden relative">
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

            {/* BOTTOM CONSOLE BAR & RUN BUTTON (Strict Single Line Layout) */}
            <div className="bg-[#181818] border-t border-[#282828] px-3 py-2 flex items-center justify-between shrink-0 gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className="px-3 py-1 bg-[#262626] hover:bg-[#333] text-slate-300 font-bold text-xs rounded-lg border border-[#383838] transition flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <FaTerminal className="text-sky-400 text-xs" />
                <span>Console</span>
                {showConsole ? <FaCaretDown className="text-xs" /> : <FaCaretUp className="text-xs" />}
              </button>

              {/* Run Code Button */}
              <button
                onClick={handleRunCandidateCode}
                disabled={executing}
                className="px-4 py-1 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                {executing ? (
                  <FaSpinner className="animate-spin text-amber-400 text-xs" />
                ) : (
                  <FaPlay className="text-[10px]" />
                )}
                <span>{executing ? "Executing..." : "Run Code"}</span>
              </button>

              {/* Live Monitoring Pill */}
              <div className="px-3 py-1 bg-[#262626] text-amber-300 text-[11px] font-bold rounded-lg border border-[#383838] flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span>Live Candidate Monitor</span>
              </div>
            </div>

            {/* CONSOLE OUTPUT PANEL OVERLAY */}
            {showConsole && (
              <div className="bg-[#111111] border-t border-[#282828] p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-xs animate-fade-in shrink-0">
                <div className="flex items-center justify-between border-b border-[#282828] pb-1.5">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-2">
                    <FaTerminal className="text-sky-400" />
                    Remote Console Output
                  </span>
                  <button
                    onClick={() => setShowConsole(false)}
                    className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>

                {executing ? (
                  <div className="text-center py-4 space-y-2">
                    <FaSpinner className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                    <p className="text-xs text-amber-300 font-bold uppercase">Testing Candidate Code...</p>
                  </div>
                ) : consoleOutput ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-md border text-[10px] uppercase ${consoleOutput.status === "Accepted"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          }`}
                      >
                        {consoleOutput.status}
                      </span>
                      <div className="text-slate-400 space-x-3 text-[10px]">
                        <span>Runtime: <strong className="text-amber-400">{consoleOutput.time}</strong></span>
                        <span>Memory: <strong className="text-indigo-400">{consoleOutput.memory}</strong></span>
                      </div>
                    </div>
                    <pre className="p-2.5 bg-[#181818] rounded-xl border border-[#282828] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                      {consoleOutput.output}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-center py-3 text-[11px]">
                    Click "Run Code" to test execution output.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIVE FEEDS, AUDIT TRAIL & CHAT (25% width) */}
          <div className="w-[25%] flex flex-col min-h-0 bg-[#1e1e1e] border border-[#282828] rounded-2xl overflow-hidden shadow-sm">
            {/* Header Navigation Tabs */}
            <div className="flex items-center bg-[#181818] p-1 border-b border-[#282828] shrink-0 text-center">
              <button
                onClick={() => setRightTab("feeds")}
                className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap truncate ${rightTab === "feeds" ? "bg-[#262626] text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Feeds
              </button>
              <button
                onClick={() => setRightTab("activity")}
                className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap truncate ${rightTab === "activity" ? "bg-[#262626] text-indigo-400 shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Audit Log
              </button>
              <button
                onClick={() => setRightTab("chat")}
                className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap truncate ${rightTab === "chat" ? "bg-[#262626] text-amber-400 shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Chat
              </button>
            </div>

            {/* RIGHT COLUMN: VIDEO TILES & INTERVIEWER CHAT */}
            <div className="w-[26%] bg-[#262626] rounded-2xl border border-[#333] flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[#333] space-y-2.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Participant Streams</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#141414] p-3 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1.5 min-w-0 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-xs">
                      <FaUserGraduate />
                    </div>
                    <div className="w-full min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate px-1" title={room?.candidateName || "Candidate"}>
                        {room?.candidateName || "Candidate"}
                      </span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${candidateStatus === "Connected" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                      {candidateStatus}
                    </span>
                  </div>

                  <div className="bg-[#141414] p-3 rounded-2xl border border-[#333] flex flex-col items-center justify-between text-center gap-1.5 min-w-0 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs">
                      <FaUserTie />
                    </div>
                    <div className="w-full min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate px-1" title="Rahul (Admin)">
                        Rahul (Admin)
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      Host
                    </span>
                  </div>
                </div>
              </div>

              {/* INTERVIEW CHAT SECTION */}
              <div className="flex-1 flex flex-col border-t border-[#282828] pt-2.5 min-h-0">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5 block">
                  INTERVIEW CHAT
                </span>

                <div className="flex-1 bg-[#141414] p-2.5 rounded-xl border border-[#282828] overflow-y-auto space-y-2 text-xs font-sans min-h-0 scrollbar-hide">
                  {chatMessages.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-6 font-medium">
                      No chat messages yet.
                    </p>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-xs space-y-1 ${msg.role === "Admin" || msg.role === "Interviewer"
                            ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-200"
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-200"
                          }`}
                      >
                        <div className="flex items-center justify-between text-[9px] opacity-75 font-bold">
                          <span>{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="font-medium leading-snug text-[11px]">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="mt-2 flex items-center space-x-1.5 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#141414] text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-[#282828] focus:outline-none focus:border-[#ffa116] font-semibold"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#ffa116] hover:bg-[#e69113] text-black rounded-xl transition cursor-pointer font-bold shrink-0"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </form>
              </div>
            </div>
            ) : rightTab === "activity" ? (
            <div className="flex-1 p-3 flex flex-col overflow-hidden min-h-0">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <FaListUl className="text-indigo-400 text-xs" />
                  <span>Audit Trail</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500">{activityLogs.length} events</span>
              </div>

              <div className="flex-1 bg-[#141414] p-2.5 rounded-xl border border-[#282828] overflow-y-auto space-y-2 text-xs font-sans scrollbar-hide min-h-0">
                {activityLogs.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center py-8">
                    Audit logs will stream here live...
                  </p>
                ) : (
                  activityLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-[#181818] border border-[#282828] space-y-0.5">
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                        <span>{log.actor} ({log.role})</span>
                        <span className="font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-slate-200 font-medium leading-snug">{log.actionText}</p>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
            ) : (
            <div className="flex-1 flex flex-col p-3 overflow-hidden min-h-0">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 block shrink-0">
                INTERVIEW CHAT
              </span>

              <div className="flex-1 bg-[#141414] p-2.5 rounded-xl border border-[#282828] overflow-y-auto space-y-2 text-xs font-sans scrollbar-hide min-h-0">
                {chatMessages.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center py-10">No chat messages yet.</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                      <div className="flex justify-between text-[9px] opacity-75 font-bold">
                        <span>{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-medium leading-snug mt-1 text-[11px]">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="mt-2 flex items-center space-x-1.5 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#141414] text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-[#282828] focus:outline-none focus:border-[#ffa116]"
                />
                <button type="submit" className="p-2 bg-[#ffa116] text-black rounded-xl cursor-pointer">
                  <FaPaperPlane className="text-xs" />
                </button>
              </form>
            </div>
          )}
          </div>
        </div>

        {/* PROBLEM BANK SWAPPER MODAL FOR ADMIN */}
        {showProblemBankModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-[#282828] text-slate-100 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#282828] pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FaBookOpen className="text-[#ffa116]" />
                  <span>Select & Push Problem to Room</span>
                </h3>
                <button onClick={() => setShowProblemBankModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {LEETCODE_BANK.map((pb) => (
                  <div
                    key={pb.questionId}
                    onClick={() => handleSwapProblem(pb)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${qObj.questionId === pb.questionId
                        ? "bg-[#ffa116]/10 border-[#ffa116] text-white"
                        : "bg-[#141414] border-[#282828] hover:border-slate-500 text-slate-300"
                      }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-white">{pb.question}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{pb.problemDescription}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30">
                      {pb.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE SETTINGS MODAL */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-[#282828] text-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#282828] pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FaCog className="text-[#ffa116]" />
                  <span>Workspace Settings</span>
                </h3>
                <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-[#ffa116]">Editor Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "vs-dark", label: "🌙 VS Dark" },
                      { id: "light", label: "☀️ VS Light" },
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => {
                          setEditorTheme(thm.id);
                          localStorage.setItem("editor_theme", thm.id);
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${editorTheme === thm.id ? "bg-[#ffa116] text-black border-[#ffa116]" : "bg-[#141414] border-[#282828] text-slate-300"
                          }`}
                      >
                        {thm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 py-2 bg-[#ffa116] text-black font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      );
}
