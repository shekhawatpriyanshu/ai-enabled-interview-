import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import { getLiveInterviewRoomById, endLiveInterviewRoom } from "../../services/liveInterviewService";
import { useAuth } from "../../context/AuthContext";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Code2,
  Send,
  User,
  ShieldAlert,
  Copy,
  Check,
  Radio,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function RealtimeInterviewRoom() {
  const { roomId: urlRoomId } = useParams();
  const roomId = urlRoomId || "demo";
  const [searchParams] = useSearchParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { user } = useAuth();

  // Role: 'Interviewer' or 'Candidate'
  const initialRole = searchParams.get("role") || "Candidate";
  const [userRole, setUserRole] = useState(initialRole);
  const [userName, setUserName] = useState(
    initialRole === "Interviewer" ? "Interviewer" : user?.name || "Priyanshu"
  );

  // Room State
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("In-Progress");
  const [question, setQuestion] = useState("Explain Redis caching.");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [tempQuestion, setTempQuestion] = useState("");

  // Live Coding State
  const [code, setCode] = useState("// Write code solution here...\n");
  const [language, setLanguage] = useState("javascript");
  const [codeOutput, setCodeOutput] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Presence & Typing State
  const [participants, setParticipants] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(512); // e.g. 08:32 = 512 sec
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const [copied, setCopied] = useState(false);

  // Load initial room data
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await getLiveInterviewRoomById(roomId);
        if (res.success && res.room) {
          setRoomData(res.room);
          setStatus(res.room.status || "In-Progress");
          setQuestion(res.room.currentQuestion || "Explain Redis caching.");
          setCode(res.room.currentCode || "// Write live code answer here\n");
          setLanguage(res.room.codeLanguage || "javascript");
          setTimerSeconds(res.room.timerRemaining || 600);
          setChatMessages(res.room.chatMessages || []);
          if (initialRole === "Candidate" && res.room.candidateName) {
            setUserName(res.room.candidateName);
          }
        }
      } catch (err) {
        console.error("Failed to load interview room:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomId, initialRole]);

  // Socket.IO Room Connection & Event Listeners
  useEffect(() => {
    socket.emit("join_interview_room", { roomId, role: userRole, userName });

    socket.on("interview_presence_update", (data) => {
      setParticipants(data.participants || []);
    });

    socket.on("interview_code_update", ({ code: newCode, language: newLang }) => {
      if (newCode !== undefined) setCode(newCode);
      if (newLang !== undefined) setLanguage(newLang);
    });

    socket.on("interview_typing_indicator", ({ isTyping, userName: typingName }) => {
      if (isTyping && typingName !== userName) {
        setTypingUser(typingName);
      } else {
        setTypingUser(null);
      }
    });

    socket.on("interview_receive_message", (msgObj) => {
      setChatMessages((prev) => [...prev, msgObj]);
    });

    socket.on("interview_timer_updated", ({ action, remainingSeconds }) => {
      if (remainingSeconds !== undefined) setTimerSeconds(remainingSeconds);
      if (action === "start") setIsTimerRunning(true);
      if (action === "pause") setIsTimerRunning(false);
      if (action === "reset") setIsTimerRunning(false);
    });

    socket.on("interview_question_changed", ({ question: newQ }) => {
      setQuestion(newQ);
    });

    socket.on("interview_status_changed", ({ status: newStatus }) => {
      setStatus(newStatus);
    });

    return () => {
      socket.off("interview_presence_update");
      socket.off("interview_code_update");
      socket.off("interview_typing_indicator");
      socket.off("interview_receive_message");
      socket.off("interview_timer_updated");
      socket.off("interview_question_changed");
      socket.off("interview_status_changed");
    };
  }, [roomId, userRole, userName]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typingUser]);

  // Synchronized Timer Countdown logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setIsTimerRunning(false);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer Controls
  const handleStartTimer = () => {
    setIsTimerRunning(true);
    socket.emit("timer_control", { roomId, action: "start" });
    socket.emit("interview_timer_control", { roomId, action: "start", remainingSeconds: timerSeconds });
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    socket.emit("timer_control", { roomId, action: "pause" });
    socket.emit("interview_timer_control", { roomId, action: "pause", remainingSeconds: timerSeconds });
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(600);
    socket.emit("timer_control", { roomId, action: "reset" });
    socket.emit("interview_timer_control", { roomId, action: "reset", remainingSeconds: 600 });
  };

  // Handle Code Change
  const handleCodeEditorChange = (newCode) => {
    setCode(newCode);
    socket.emit("interview_code_change", { roomId, code: newCode, language });

    // Emit typing indicator
    socket.emit("interview_typing_start", { roomId, userName, role: userRole });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("interview_typing_stop", { roomId, userName, role: userRole });
    }, 1200);
  };

  // Handle Question Change by Interviewer
  const handleSaveQuestion = () => {
    if (!tempQuestion.trim()) return;
    setQuestion(tempQuestion);
    setIsEditingQuestion(false);
    socket.emit("interview_question_update", { roomId, question: tempQuestion });
  };

  // Handle Status Change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    socket.emit("interview_status_update", { roomId, status: newStatus });
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    socket.emit("interview_send_message", {
      roomId,
      senderName: userName,
      role: userRole,
      message: chatInput.trim(),
    });
    setChatInput("");
    socket.emit("interview_typing_stop", { roomId, userName, role: userRole });
  };

  // Chat typing handler
  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
    socket.emit("interview_typing_start", { roomId, userName, role: userRole });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("interview_typing_stop", { roomId, userName, role: userRole });
    }, 1500);
  };

  // Run Code Simulation
  const handleRunCode = () => {
    setIsRunningCode(true);
    setCodeOutput("Executing code...");
    setTimeout(() => {
      try {
        let outputLogs = [];
        const customConsole = {
          log: (...args) => outputLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(" ")),
          error: (...args) => outputLogs.push("ERROR: " + args.join(" ")),
        };
        const runFn = new Function("console", code);
        runFn(customConsole);
        setCodeOutput(outputLogs.length > 0 ? outputLogs.join("\n") : "Code executed successfully with no output.");
      } catch (err) {
        setCodeOutput(`Runtime Error: ${err.message}`);
      } finally {
        setIsRunningCode(false);
      }
    }, 800);
  };

  // Copy Room Link
  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check Presence of candidate / interviewer
  const candidateOnline = participants.some((p) => p.role === "Candidate") || userRole === "Candidate";
  // eslint-disable-next-line no-unused-vars
  const interviewerOnline = participants.some((p) => p.role === "Interviewer") || userRole === "Interviewer";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-sky-400 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Initializing Real-Time Interview Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* HEADER BAR */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0c101d]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Live Interview Room
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  {roomId}
                </span>
              </h1>
              <p className="text-xs text-slate-400">Interviewer ↔ Socket.IO ↔ Candidate</p>
            </div>
          </div>

          <button
            onClick={copyRoomLink}
            className="flex items-center space-x-1.5 text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Link" : "Invite"}</span>
          </button>
        </div>

        {/* CANDIDATE STATUS & TIMER & STATUS BADGE */}
        <div className="flex items-center space-x-6">
          {/* Candidate Status Badge */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-slate-400" />
            <div className="text-xs">
              <span className="text-slate-400">Candidate: </span>
              <span className="font-semibold text-slate-200">{roomData?.candidateName || userName}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                candidateOnline
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${candidateOnline ? "bg-emerald-400 animate-ping" : "bg-rose-500"}`} />
              {candidateOnline ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>

          {/* Interview Status Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 ${
                status === "In-Progress"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : status === "Paused"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : status === "Completed"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Status: {status}
            </span>
          </div>

          {/* TIMER DISPLAY */}
          <div className="flex items-center space-x-3 bg-slate-900/90 px-4 py-1.5 rounded-xl border border-slate-800">
            <Clock className={`w-4 h-4 ${isTimerRunning ? "text-amber-400 animate-pulse" : "text-slate-400"}`} />
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block leading-none">
                Timer
              </span>
              <span className="font-mono text-lg font-bold text-white leading-tight">
                {formatTime(timerSeconds)}
              </span>
            </div>

            {/* Interviewer Quick Timer Controls */}
            {userRole === "Interviewer" && (
              <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
                {isTimerRunning ? (
                  <button
                    onClick={handlePauseTimer}
                    title="Pause Timer"
                    className="p-1 hover:bg-amber-500/20 text-amber-400 rounded-md transition"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartTimer}
                    title="Start Timer"
                    className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleResetTimer}
                  title="Reset Timer (10m)"
                  className="p-1 hover:bg-slate-800 text-slate-400 rounded-md transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ROLE TOGGLER SWITCH */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setUserRole("Candidate");
                setUserName("Priyanshu");
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                userRole === "Candidate"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => {
                setUserRole("Interviewer");
                setUserName("Interviewer");
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                userRole === "Interviewer"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interviewer
            </button>
          </div>
        </div>
      </header>

      {/* MAIN INTERVIEW CONTENT SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: QUESTION + LIVE MONACO CODE EDITOR */}
        <div className="flex-1 flex flex-col border-r border-slate-800/80 bg-[#090d16]">
          {/* QUESTION BOX */}
          <div className="p-5 border-b border-slate-800 bg-[#0d1220]/70 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Live Question
                </span>
              </div>
              {userRole === "Interviewer" && !isEditingQuestion && (
                <button
                  onClick={() => {
                    setTempQuestion(question);
                    setIsEditingQuestion(true);
                  }}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  Edit Question
                </button>
              )}
            </div>

            {isEditingQuestion ? (
              <div className="space-y-3">
                <textarea
                  value={tempQuestion}
                  onChange={(e) => setTempQuestion(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-sm p-3 rounded-xl border border-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditingQuestion(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveQuestion}
                    className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg shadow-lg shadow-sky-600/30"
                  >
                    Update Question for Candidate
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80">
                <p className="text-base font-semibold text-slate-100 leading-relaxed">{question}</p>
              </div>
            )}
          </div>

          {/* CODE EDITOR BAR */}
          <div className="bg-[#0b0f19] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Live Code Editor</span>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  socket.emit("interview_code_change", { roomId, code, language: e.target.value });
                }}
                className="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-800 focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg font-medium shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningCode ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          {/* MONACO CODE EDITOR */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleCodeEditorChange}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                automaticLayout: true,
                cursorBlinking: "smooth",
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* EXECUTION OUTPUT CONSOLE */}
          {codeOutput && (
            <div className="h-36 bg-[#060910] border-t border-slate-800 p-3 font-mono text-xs overflow-y-auto">
              <div className="flex items-center justify-between mb-1.5 text-slate-400">
                <span className="uppercase text-[10px] tracking-wider font-semibold text-emerald-400">
                  Execution Output
                </span>
                <button
                  onClick={() => setCodeOutput("")}
                  className="hover:text-slate-200 text-[11px]"
                >
                  Clear
                </button>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap">{codeOutput}</pre>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: CHAT, TYPING INDICATOR & INTERVIEWER CONTROL CENTER */}
        <div className="w-96 flex flex-col bg-[#0b0f1a] border-l border-slate-800/80">
          {/* INTERVIEWER CONTROLS PANEL */}
          {userRole === "Interviewer" && (
            <div className="p-4 border-b border-slate-800 bg-[#0f1424]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Interviewer Control Panel
              </h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Set Interview Status:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["In-Progress", "Paused", "Completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition ${
                          status === st
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Finish Session:</span>
                  <button
                    onClick={async () => {
                      await endLiveInterviewRoom(roomId);
                      handleStatusChange("Completed");
                    }}
                    className="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-600/30 px-3 py-1 rounded-md transition"
                  >
                    End Interview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHAT HEADER */}
          <div className="p-3.5 border-b border-slate-800/80 bg-[#0d1222] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">Interview Chat & Notes</span>
            </div>
            <span className="text-[10px] text-slate-500">{chatMessages.length} messages</span>
          </div>

          {/* CHAT MESSAGES LIST */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#090d18]">
            {chatMessages.map((msg) => {
              const isMe = msg.senderName === userName;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {msg.senderName} ({msg.role})
                    </span>
                    <span className="text-[9px] text-slate-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] text-xs p-3 rounded-2xl leading-relaxed ${
                      isMe
                        ? "bg-sky-600 text-white rounded-br-none shadow-md shadow-sky-600/20"
                        : msg.role === "System"
                        ? "bg-slate-800/60 text-slate-400 italic text-center w-full border border-slate-800"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {typingUser && (
              <div className="flex items-center space-x-2 text-xs text-sky-400 italic pt-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>{typingUser} is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-[#0d1222]">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={handleChatInputChange}
                placeholder="Type your message or answer..."
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md shadow-sky-600/30 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
