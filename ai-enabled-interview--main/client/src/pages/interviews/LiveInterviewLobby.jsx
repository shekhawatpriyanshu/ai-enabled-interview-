import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getLiveInterviewRooms, createLiveInterviewRoom, getAllUsers } from "../../services/liveInterviewService";
import { isInterviewTimeReached, isInterviewWindowExceeded } from "../../utils/interviewTimeUtils";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";
import {
  Radio,
  Users,
  Play,
  ArrowRight,
  Sparkles,
  Bell,
  X,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  CheckCircle2,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";

import { getProfile } from "../../services/ProfileService";
import { checkIsHostUser } from "../../utils/userRoleUtils";

export default function LiveInterviewLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [invitationToast, setInvitationToast] = useState(null);
  const [toastCountdown, setToastCountdown] = useState(30);
  const [profileUserType, setProfileUserType] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data?.profile?.userType) {
          setProfileUserType(data.profile.userType);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    let interval = null;
    if (invitationToast) {
      setToastCountdown(30);
      interval = setInterval(() => {
        setToastCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setInvitationToast(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [invitationToast]);

  // Registered database users for email selection
  const [userList, setUserList] = useState([]);

  // Tabs: "all", "upcoming", "live", "completed"
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [waitingRoomModal, setWaitingRoomModal] = useState(null);

  // Candidate Create Interview State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCandidateName, setCreateCandidateName] = useState(() => user?.name || "Priyanshu");
  const [createCandidateEmail, setCreateCandidateEmail] = useState(() => user?.email || "priyanshu@gmail.com");
  const [createHostEmail, setCreateHostEmail] = useState(() => user?.email || "shreee@gmail.com");
  const [createInterviewerName, setCreateInterviewerName] = useState("Rahul (Technical Lead)");
  const [createParticipantRole, setCreateParticipantRole] = useState("Candidate");
  const getCurrentFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)} ${ampm}`;
  };

  const [createScheduledDate, setCreateScheduledDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [createScheduledTime, setCreateScheduledTime] = useState("03:00 PM");
  const [createRole, setCreateRole] = useState("MERN Stack Developer");
  const [createDuration, setCreateDuration] = useState(30);
  const [creating, setCreating] = useState(false);

  // Auto-refresh date & time to live current time when modal opens
  useEffect(() => {
    if (showCreateModal) {
      setCreateScheduledDate(new Date().toISOString().split("T")[0]);
      setCreateScheduledTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    }
  }, [showCreateModal]);

  // Pre-added Questions State (Technical vs Coding)
  const [preaddedQuestions, setPreaddedQuestions] = useState([
    {
      questionId: "q1",
      question: "Explain the difference between JWT authentication and session authentication.",
      type: "Technical",
      problemDescription: "Describe how JWT tokens work vs traditional session-based cookies in Web applications.",
      initialCode: "",
      order: 1,
    },
    {
      questionId: "q2",
      question: "Write an LRU Cache implementation in JavaScript with get() and put() methods.",
      type: "Coding",
      problemDescription: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      initialCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}\n`,
      order: 2,
    },
  ]);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQType, setNewQType] = useState("Technical");
  const [newQDesc, setNewQDesc] = useState("");
  const [newQCode, setNewQCode] = useState("");

  const handleAddQuestion = () => {
    if (!newQTitle.trim()) return;
    const qObj = {
      questionId: `q_${Date.now()}`,
      question: newQTitle.trim(),
      type: newQType,
      problemDescription: newQDesc.trim() || newQTitle.trim(),
      initialCode: newQCode.trim(),
      order: preaddedQuestions.length + 1,
    };
    setPreaddedQuestions((prev) => [...prev, qObj]);
    setNewQTitle("");
    setNewQDesc("");
    setNewQCode("");
  };

  const handleRemoveQuestion = (idx) => {
    setPreaddedQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const userEmail = user?.email || "priyanshu@gmail.com";

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getLiveInterviewRooms(userEmail);
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      console.error("Error fetching candidate rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Fetch all registered database users
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res.success && Array.isArray(res.users)) {
          setUserList(res.users);
          if (res.users.length > 0) {
            setCreateCandidateEmail(res.users[0].email);
            setCreateCandidateName(res.users[0].name || "Candidate");
          }
        }
      } catch (err) {
        console.error("Error fetching user list:", err);
      }
    };
    fetchUsers();

    const registerSocket = () => {
      if (userEmail) {
        socket.emit("register_user_email", userEmail);
      }
    };

    registerSocket();
    socket.on("connect", registerSocket);

    const handleInvitation = (data) => {
      if (!data) return;
      const target = (data.targetEmail || "").trim().toLowerCase();
      const current = (userEmail || "").trim().toLowerCase();

      if (target && target === current) {
        setInvitationToast(data);
        fetchRooms();
      }
    };

    const handleCandidateAccepted = (data) => {
      if (!data?.roomId) return;
      const roomPath = `/interview-room/${data.roomId}`;
      if (!window.location.pathname.includes(data.roomId)) {
        navigate(roomPath);
      }
    };

    socket.on("live_interview_invitation", handleInvitation);
    socket.on("candidate_accepted_invite", handleCandidateAccepted);

    return () => {
      socket.off("connect", registerSocket);
      socket.off("live_interview_invitation", handleInvitation);
      socket.off("candidate_accepted_invite", handleCandidateAccepted);
    };
  }, [userEmail, navigate]);

  const handleJoinById = (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) return;
    setWaitingRoomModal(rooms.find((r) => r.roomId === joinRoomId.trim()) || { roomId: joinRoomId.trim() });
  };

  const handleCreateCandidateInterview = async (e) => {
    e.preventDefault();
    if (!createCandidateEmail) return;
    setCreating(true);
    try {
      const res = await createLiveInterviewRoom({
        candidateEmail: createCandidateEmail.trim().toLowerCase(),
        candidateName: createCandidateName || "Candidate",
        interviewerName: createInterviewerName || (user?.name ? `${user.name} (${createHostEmail})` : createHostEmail),
        creatorEmail: createHostEmail.trim().toLowerCase(),
        hostEmail: createHostEmail.trim().toLowerCase(),
        role: createRole,
        interviewType: "Coding",
        scheduledDate: createScheduledDate,
        scheduledTime: createScheduledTime,
        duration: Number(createDuration),
        questions: preaddedQuestions.length > 0 ? preaddedQuestions : [
          {
            questionId: "q1",
            type: "Technical",
            question: "Explain the difference between JWT authentication and session authentication.",
            problemDescription: "Describe how JWT tokens work vs traditional session-based cookies in Web applications.",
            initialCode: "",
          },
          {
            questionId: "q2",
            type: "Coding",
            question: "Write an LRU Cache implementation in JavaScript with get() and put() methods.",
            problemDescription: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
            initialCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}\n`,
          },
        ],
      });

      if (res.success && res.room) {
        setShowCreateModal(false);
        fetchRooms();
        setWaitingRoomModal(res.room);
      }
    } catch (err) {
      console.error("Create candidate room error:", err);
    } finally {
      setCreating(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const windowExceeded = isInterviewWindowExceeded(r.scheduledDate, r.scheduledTime, r.duration);
    const isTimeReached = isInterviewTimeReached(r.scheduledDate, r.scheduledTime);
    const st = (r.status || "").toLowerCase();

    if (activeTab === "upcoming") return !isTimeReached || st === "scheduled" || st === "waiting";
    if (activeTab === "live") return isTimeReached && !windowExceeded && (st === "active" || st === "in-progress" || st === "waiting");
    if (activeTab === "completed") return st === "completed";
    return true;
  });

  const getStatusBadge = (status, roomItem) => {
    const windowExceeded = isInterviewWindowExceeded(roomItem?.scheduledDate, roomItem?.scheduledTime, roomItem?.duration);
    if (status === "cancelled" || status === "Cancelled" || windowExceeded) {
      return (
        <span className="text-[11px] px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 font-extrabold border border-rose-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <X className="w-3.5 h-3.5" />
          Closed ❌
        </span>
      );
    }

    const st = (status || "").toLowerCase();
    const isTimeReached = isInterviewTimeReached(roomItem?.scheduledDate, roomItem?.scheduledTime);

    // If scheduled start time has NOT arrived yet, show "Scheduled" badge regardless!
    if (!isTimeReached && st !== "completed") {
      return (
        <span className="text-[11px] px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 font-bold border border-sky-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          Scheduled 📅
        </span>
      );
    }

    if (st === "active" || st === "in-progress") {
      return (
        <span className="text-[11px] px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 font-extrabold border border-rose-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          Live 🔴
        </span>
      );
    }
    if (st === "completed") {
      return (
        <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed ✅
        </span>
      );
    }
    return (
      <span className="text-[11px] px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5" />
        Waiting ⏳
      </span>
    );
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white animate-fade-in">
        {/* REAL-TIME TARGETED INVITATION TOAST BANNER (30 SEC TIMER) */}
        {invitationToast && (
          <div className="max-w-6xl mx-auto mb-8 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 border border-sky-400/40 p-4 md:p-5 rounded-3xl shadow-2xl shadow-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-bounce transition-all duration-300 relative overflow-hidden">
            {/* Animated 30s Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-1.5 bg-amber-400 transition-all duration-1000 ease-linear shadow-md"
              style={{ width: `${(toastCountdown / 30) * 100}%` }}
            />

            <div className="flex items-center space-x-3.5 text-white">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner shrink-0">
                <Bell className="w-6 h-6 text-amber-300 animate-wiggle" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] uppercase font-black tracking-widest text-sky-200 block">
                    🚨 Real-Time Live Interview Notification
                  </span>
                  <span className="text-[10px] font-mono font-black bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full shadow-sm">
                    ⏱️ Expires in {toastCountdown}s
                  </span>
                </div>
                <p className="text-sm md:text-base font-black tracking-tight">{invitationToast.message || "You have been invited to a Live Interview!"}</p>
                <span className="text-xs text-sky-100 font-mono font-semibold">Target User: {invitationToast.targetEmail || userEmail} | Room ID: {invitationToast.roomId}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setWaitingRoomModal(invitationToast)}
                className="px-6 py-3 bg-white text-indigo-950 hover:bg-slate-100 font-black text-xs rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                JOIN INTERVIEW NOW
              </button>
              <button
                onClick={() => setInvitationToast(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-8 md:p-10 shadow-2xl text-white group">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl group-hover:bg-sky-500/30 transition-all duration-700 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black uppercase tracking-widest">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    <span>LeetChef Live Workspace</span>
                  </div>

                  {(() => {
                    const uType = (profileUserType || user?.userType || user?.profile?.userType || "").trim().toLowerCase();
                    const uRole = (user?.role || "").trim().toLowerCase();
                    const isWorkingProfessional = uType === "working professional" || uRole === "admin" || uRole === "interviewer";

                    return (
                      <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${isWorkingProfessional
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        }`}>
                        <span>{isWorkingProfessional ? "👨‍💼 Working Professional (Host)" : "🎓 Student (Candidate)"}</span>
                      </span>
                    );
                  })()}
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Live Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-400 to-indigo-300">Interview Hub</span>
                </h1>
                <p className="text-slate-300 text-sm md:text-base mt-3 max-w-2xl font-semibold leading-relaxed">
                  Real-time pair programming, live technical question streams, read-only monitoring, and AI evaluation report analytics for <strong className="text-amber-400 font-bold">{userEmail}</strong>.
                </p>
              </div>

              {(() => {
                const uType = (profileUserType || user?.userType || user?.profile?.userType || "").trim().toLowerCase();
                const uRole = (user?.role || "").trim().toLowerCase();
                const isWorkingProfessional = uType === "working professional" || uRole === "admin" || uRole === "interviewer";

                if (!isWorkingProfessional) return null;

                return (
                  <div className="shrink-0">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-7 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer border border-amber-300/40"
                    >
                      <Plus className="w-5 h-5 stroke-[3]" />
                      <span>Create Interview Room</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* QUICK JOIN BY ROOM ID */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-400/60 transition-all duration-300">
            <div>
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" /> Direct Room Access
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Have an interview room code? Enter your Room ID below to jump directly into your waiting room.
              </p>
            </div>
            <form onSubmit={handleJoinById} className="flex items-center space-x-3 w-full md:w-auto">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="e.g. ROOM_8F32K"
                className="bg-slate-50 text-slate-800 text-xs font-mono px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-72 transition-all font-semibold"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-lg shadow-indigo-500/25"
              >
                <span>Join</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* INTERVIEW TABS & GRID */}
        <div className="max-w-6xl mx-auto">
          {/* TAB STRIP */}
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 mb-6 shadow-sm">
            <div className="flex items-center space-x-2">
              {[
                { id: "all", label: "All Sessions" },
                { id: "upcoming", label: "Upcoming 🟡" },
                { id: "live", label: "Live 🔴" },
                { id: "completed", label: "Completed ✅" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-400 font-mono px-3">
              {filteredRooms.length} interview(s)
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-500 font-semibold">
              <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs tracking-wider uppercase font-bold text-slate-400">Loading interview invitations...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-14 text-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold text-base">No interviews found in this category.</p>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold">Scheduled live interviews created by Hosts will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {filteredRooms.map((rm) => (
                <div
                  key={rm.roomId}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4 ">
                      <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-3 py-1 rounded-full font-bold whitespace-nowrap shrink-0 inline-flex items-center">
                        ID: {rm.roomId}
                      </span>
                      {getStatusBadge(rm.status, rm)}
                    </div>

                    <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 mb-2 leading-snug">
                      {rm.role || "Technical Interview"}
                    </h3>

                    <div className="space-y-2 mb-5 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Date: {rm.scheduledDate || "20 Aug 2026"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Time: {rm.scheduledTime || "03:00 PM"} ({rm.duration || 30} mins)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="break-words">Interviewer: <strong className="text-slate-900">{rm.interviewerName || "Host"}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5">
                    <button
                      onClick={() => setSelectedRoomDetails(rm)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {rm.status === "completed" || rm.status === "Completed" ? (
                      <button
                        onClick={() => navigate(`/interviews/room/${rm.roomId}`)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 inline-flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>View Evaluation Report</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setWaitingRoomModal(rm)}
                        className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 inline-flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                        <span>Join Interview</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. INTERVIEW DETAILS MODAL */}
        {selectedRoomDetails && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl space-y-5 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Interview Overview</span>
                  <h2 className="text-xl font-black text-slate-900">{selectedRoomDetails.role || "Technical Interview"}</h2>
                </div>
                <button
                  onClick={() => setSelectedRoomDetails(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Room ID</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedRoomDetails.roomId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Date & Time</span>
                  <span>{selectedRoomDetails.scheduledDate || "20 Aug 2026"} @ {selectedRoomDetails.scheduledTime || "03:00 PM"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Interviewer</span>
                  <span className="font-bold">{selectedRoomDetails.interviewerName || "Rahul (Admin)"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Interview Type</span>
                  <span className="font-bold">{selectedRoomDetails.interviewType || "Technical"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Duration</span>
                  <span>{selectedRoomDetails.duration || 30} minutes</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Status</span>
                  <span>{getStatusBadge(selectedRoomDetails.status)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">📝 Interview Instructions:</span>
                <p className="text-slate-500 leading-relaxed font-sans">
                  Ensure a stable internet connection. Test your microphone and camera before entering the room. Maintain clean code structure during live coding challenges.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedRoomDetails(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const rm = selectedRoomDetails;
                    setSelectedRoomDetails(null);
                    setWaitingRoomModal(rm);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Proceed to Waiting Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. WAITING ROOM / DEVICE PRE-FLIGHT TEST MODAL */}
        {waitingRoomModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Interview Waiting Room
                </span>
                <h2 className="text-xl font-black text-white">Pre-Flight Hardware Check</h2>
                <p className="text-xs text-slate-400">
                  Interview Room <strong className="text-sky-400 font-mono">{waitingRoomModal.roomId}</strong>
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Scheduled Time:</span>
                  <span className="font-bold text-white">{waitingRoomModal.scheduledTime || "03:00 PM"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Interviewer:</span>
                  <span className="font-bold text-white">{waitingRoomModal.interviewerName || "Rahul (Admin)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-amber-400 font-bold">🟡 Waiting for Host...</span>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  onClick={() => setWaitingRoomModal(null)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const id = waitingRoomModal.roomId;
                    const uEmail = (user?.email || "").trim().toLowerCase();
                    const uName = (user?.name || "").trim().toLowerCase();
                    const uType = (user?.userType || user?.profile?.userType || "").trim().toLowerCase();

                    const hEmail = (waitingRoomModal.hostEmail || waitingRoomModal.creatorEmail || "").trim().toLowerCase();
                    const cEmail = (waitingRoomModal.candidateEmail || "").trim().toLowerCase();
                    const iName = (waitingRoomModal.interviewerName || "").trim().toLowerCase();

                    let isUserHost = false;
                    if (cEmail && uEmail && uEmail === cEmail) {
                      isUserHost = false;
                    } else if (hEmail && uEmail && uEmail === hEmail) {
                      isUserHost = true;
                    } else if (uType === "working professional" || user?.role === "admin" || user?.role === "interviewer") {
                      isUserHost = true;
                    } else if (iName && uName && iName.includes(uName)) {
                      isUserHost = true;
                    }

                    const isCancelled = waitingRoomModal.status === "cancelled" || waitingRoomModal.status === "Cancelled";

                    if (isCancelled) {
                      alert("❌ Session Closed:\n\nThis interview session has been closed.");
                      return;
                    }

                    const timeReached = isInterviewTimeReached(waitingRoomModal.scheduledDate, waitingRoomModal.scheduledTime);
                    if (!isUserHost && !timeReached) {
                      alert(`⏰ Early Entry Restricted:\n\nThis interview is scheduled for ${waitingRoomModal.scheduledTime || "03:00 PM"}.\nCandidates can only join on time. Please return at ${waitingRoomModal.scheduledTime || "03:00 PM"}.`);
                      return;
                    }

                    setWaitingRoomModal(null);
                    navigate(`/interview-room/${id}`);
                  }}
                  className="px-7 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-105"
                >
                  Enter Room
                </button>
              </div>
            </div>
          </div>
        )}
        {/* CANDIDATE CREATE INTERVIEW MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl space-y-6 text-slate-800 animate-fade-in relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Create Live Interview Room</h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Schedule an instant live technical session for {userEmail}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCandidateInterview} className="space-y-4 text-xs font-semibold overflow-y-auto max-h-[75vh] pr-1">
                {/* SELECT CANDIDATE USER (FETCHED DATABASE USERS) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Candidate (User)</label>
                  {userList && userList.length > 0 ? (
                    <select
                      value={createCandidateEmail}
                      onChange={(e) => {
                        const selectedEmail = e.target.value;
                        setCreateCandidateEmail(selectedEmail);
                        const matchedUser = userList.find((u) => u.email === selectedEmail);
                        if (matchedUser && matchedUser.name) {
                          setCreateCandidateName(matchedUser.name);
                        }
                      }}
                      required
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      {userList.map((u, i) => (
                        <option key={i} value={u.email}>
                          {u.name ? `${u.name} (${u.email})` : u.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="email"
                      value={createCandidateEmail}
                      onChange={(e) => setCreateCandidateEmail(e.target.value)}
                      required
                      placeholder="e.g. candidate@example.com"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Candidate Name</label>
                    <input
                      type="text"
                      value={createCandidateName}
                      onChange={(e) => setCreateCandidateName(e.target.value)}
                      required
                      placeholder="e.g. Priyanshu"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Interviewer Name</label>
                    <input
                      type="text"
                      value={createInterviewerName}
                      onChange={(e) => setCreateInterviewerName(e.target.value)}
                      required
                      placeholder="e.g. Rahul (Technical Lead)"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Host / Interviewer Email</label>
                    <input
                      type="email"
                      value={createHostEmail}
                      onChange={(e) => setCreateHostEmail(e.target.value)}
                      required
                      placeholder="e.g. shreee@gmail.com"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Role in Session</label>
                    <select
                      value={createParticipantRole}
                      onChange={(e) => setCreateParticipantRole(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Interviewer">👨‍💼 Interviewer / Host</option>
                      <option value="Candidate">👨‍💻 Candidate / User</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Job Role</label>
                    <input
                      type="text"
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value)}
                      required
                      placeholder="e.g. MERN Stack Developer"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Duration (Minutes)</label>
                    <select
                      value={createDuration}
                      onChange={(e) => setCreateDuration(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Interview Date</label>
                    <input
                      type="date"
                      value={createScheduledDate}
                      onChange={(e) => setCreateScheduledDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-bold">Interview Time</label>
                      <button
                        type="button"
                        onClick={() => setCreateScheduledTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }))}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                        title="Click to fetch live current time"
                      >
                        ⚡ Live Time
                      </button>
                    </div>
                    <input
                      type="text"
                      value={createScheduledTime}
                      onChange={(e) => setCreateScheduledTime(e.target.value)}
                      required
                      placeholder="e.g. 03:00 PM"
                      className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* PRE-ADDED INTERVIEW QUESTIONS BUILDER (TECHNICAL & CODING) */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-900 font-black text-xs uppercase tracking-wider">
                      📝 Pre-Added Interview Questions ({preaddedQuestions.length})
                    </label>
                    <span className="text-[11px] font-bold text-indigo-600">Moves 1-by-1 on candidate submit</span>
                  </div>

                  {/* PRE-ADDED LIST */}
                  {preaddedQuestions.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {preaddedQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                          <div className="truncate flex-1">
                            <span className="font-black text-indigo-600 mr-2">Q{idx + 1}.</span>
                            <span className="font-bold text-slate-800">{q.question}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${q.type === "Technical" ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-indigo-100 text-indigo-700 border border-indigo-300"}`}>
                              {q.type}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                            title="Remove Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ADD NEW QUESTION FORM */}
                  <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-900">Add Question to Interview:</span>
                      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-indigo-200 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setNewQType("Technical")}
                          className={`px-2.5 py-1 rounded-lg transition ${newQType === "Technical" ? "bg-amber-500 text-black shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          💬 Technical Text
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewQType("Coding")}
                          className={`px-2.5 py-1 rounded-lg transition ${newQType === "Coding" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          💻 Coding Problem
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={newQTitle}
                      onChange={(e) => setNewQTitle(e.target.value)}
                      placeholder={newQType === "Technical" ? "e.g. Explain JWT vs Session Auth" : "e.g. Write LRU Cache Implementation"}
                      className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                    />

                    <textarea
                      rows={2}
                      value={newQDesc}
                      onChange={(e) => setNewQDesc(e.target.value)}
                      placeholder="Detailed Question Description / Problem Statement..."
                      className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-slate-300 focus:outline-none text-xs resize-none"
                    />

                    {newQType === "Coding" && (
                      <textarea
                        rows={2}
                        value={newQCode}
                        onChange={(e) => setNewQCode(e.target.value)}
                        placeholder="Starter Code Template (Optional)..."
                        className="w-full bg-slate-900 text-amber-300 p-2.5 rounded-xl border border-slate-800 focus:outline-none text-xs font-mono resize-none"
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add {newQType} Question to Room
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-7 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? "Creating Session..." : "Create Room Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
