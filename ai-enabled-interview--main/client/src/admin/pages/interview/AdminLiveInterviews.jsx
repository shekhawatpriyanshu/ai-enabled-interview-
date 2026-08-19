import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLiveInterviewRooms,
  createLiveInterviewRoom,
  cancelLiveInterviewRoom,
  deleteLiveInterviewRoom,
} from "../../../services/liveInterviewService";
import { getUsers } from "../../services/userService";
import { isInterviewTimeReached, isInterviewWindowExceeded } from "../../../utils/interviewTimeUtils";
import socket from "../../../socket";
import {
  FaUserTie,
  FaPlus,
  FaPlay,
  FaClock,
  FaCheckCircle,
  FaTrash,
  FaCode,
  FaLightbulb,
  FaSearch,
  FaEye,
  FaBan,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
  FaVideo,
  FaUserCheck,
  FaUserClock,
  FaTimes,
  FaMagic,
  FaCalendarAlt,
} from "react-icons/fa";

const AdminLiveInterviews = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [cancelModalRoom, setCancelModalRoom] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(null);

  // Filters & Search
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [interviewerName, setInterviewerName] = useState("Rahul (Admin)");
  const [role, setRole] = useState("MERN Developer");
  const [interviewType, setInterviewType] = useState("Technical");
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

  const [scheduledDate, setScheduledDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState(() => getCurrentFormattedTime());
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [creating, setCreating] = useState(false);

  const [questionsList, setQuestionsList] = useState([
    {
      id: "1",
      type: "Technical",
      question:
        "Explain the difference between JWT authentication and session authentication.",
      initialCode: "",
    },
    {
      id: "2",
      type: "Coding",
      question:
        "Write an LRU Cache implementation in JavaScript with get() and put() methods.",
      initialCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n  }\n  get(key) {\n    return -1;\n  }\n  put(key, value) {}\n}`,
    },
  ]);

  // Load candidate users from DB for dropdown selector
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers({ limit: 1000 });
        if (res && res.users && res.users.length > 0) {
          setUserOptions(res.users);
          setCandidateEmail(res.users[0].email);
          setCandidateName(res.users[0].name || "Candidate");
        }
      } catch (err) {
        console.error("Failed to load users for dropdown:", err);
      }
    }
    loadUsers();
  }, []);

  const addQuestion = (type) => {
    const newQ = {
      id: Date.now().toString(),
      type,
      question:
        type === "Technical"
          ? "Explain..."
          : "Write a function to solve...",
      initialCode:
        type === "Coding"
          ? "function solution() {\n  // Code here\n}\n"
          : "",
    };
    setQuestionsList((prev) => [...prev, newQ]);
  };

  const removeQuestion = (id) => {
    if (questionsList.length === 1) return;
    setQuestionsList((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, field, val) => {
    setQuestionsList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: val } : q))
    );
  };

  const fetchRooms = async () => {
    try {
      const res = await getLiveInterviewRooms();
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      console.error("Error fetching live rooms:", err);
    }
  };

  const copyRoomId = (roomId, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(roomId);
    setCopiedRoomId(roomId);
    setTimeout(() => setCopiedRoomId(null), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    async function initData() {
      try {
        const res = await getLiveInterviewRooms();
        if (isMounted && res.success) {
          setRooms(res.rooms || []);
        }
      } catch (err) {
        console.error("Error fetching live rooms:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    initData();

    socket.emit("join_admin_dashboard");

    socket.on("candidate_joined", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId
            ? {
                ...r,
                candidateConnected: true,
                status: r.status === "scheduled" ? "waiting" : r.status,
              }
            : r
        )
      );
    });

    socket.on("candidate_left", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, candidateConnected: false } : r
        )
      );
    });

    socket.on("interview_started", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId
            ? { ...r, status: "In-Progress", interviewerConnected: true }
            : r
        )
      );
    });

    socket.on("interview_ended", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, status: "Completed" } : r
        )
      );
    });

    socket.on("room_status_updated", () => {
      fetchRooms();
    });

    socket.on("candidate_accepted_invite", ({ roomId }) => {
      fetchRooms();
      if (roomId && !window.location.pathname.includes(roomId)) {
        navigate(`/admin/interview-room/${roomId}`);
      }
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("candidate_left");
      socket.off("interview_started");
      socket.off("interview_ended");
      socket.off("room_status_updated");
      socket.off("candidate_accepted_invite");
    };
  }, [navigate]);

  const handleSelectUser = (email) => {
    setCandidateEmail(email);
    const found = userOptions.find((u) => u.email === email);
    if (found) setCandidateName(found.name);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createLiveInterviewRoom({
        candidateEmail,
        candidateName,
        interviewerName,
        role,
        interviewType,
        scheduledDate,
        scheduledTime,
        duration: Number(durationMinutes),
        questions: questionsList,
      });

      if (res.success && res.room) {
        setShowModal(false);
        fetchRooms();
        navigate(`/admin/interview-room/${res.room.roomId}`);
      }
    } catch (err) {
      console.error("Failed to create room:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelRoom = async (e) => {
    e.preventDefault();
    if (!cancelModalRoom) return;
    try {
      await cancelLiveInterviewRoom(cancelModalRoom.roomId, cancelReason);
      setCancelModalRoom(null);
      setCancelReason("");
      fetchRooms();
    } catch (err) {
      console.error("Error canceling room:", err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete interview room ${roomId}?`
      )
    ) {
      return;
    }
    try {
      await deleteLiveInterviewRoom(roomId);
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert(
        "Failed to delete interview room: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Metrics
  const totalCount = rooms.length;
  const upcomingCount = rooms.filter(
    (r) =>
      r.status === "scheduled" ||
      r.status === "Scheduled" ||
      r.status === "waiting" ||
      r.status === "Waiting"
  ).length;
  const liveCount = rooms.filter(
    (r) => r.status === "active" || r.status === "In-Progress"
  ).length;
  const completedCount = rooms.filter(
    (r) => r.status === "completed" || r.status === "Completed"
  ).length;
  const cancelledCount = rooms.filter(
    (r) => r.status === "cancelled" || r.status === "Cancelled"
  ).length;

  const filteredRooms = rooms.filter((r) => {
    const matchesStatus =
      activeStatusFilter === "all" ||
      (activeStatusFilter === "upcoming" &&
        (r.status === "scheduled" || r.status === "waiting")) ||
      (activeStatusFilter === "live" &&
        (r.status === "active" || r.status === "In-Progress")) ||
      (activeStatusFilter === "completed" &&
        (r.status === "completed" || r.status === "Completed")) ||
      (activeStatusFilter === "cancelled" &&
        (r.status === "cancelled" || r.status === "Cancelled"));

    const matchesSearch =
      (r.candidateName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.candidateEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.roomId || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const renderStatusBadge = (status, roomItem) => {
    if (status === "cancelled" || status === "Cancelled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 shadow-xs whitespace-nowrap">
          <FaBan className="text-slate-400 text-xs" /> Closed ❌
        </span>
      );
    }

    const st = (status || "").toLowerCase();
    const isTimeReached = isInterviewTimeReached(roomItem?.scheduledDate, roomItem?.scheduledTime);

    if (!isTimeReached && st !== "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 shadow-xs whitespace-nowrap">
          <FaClock className="text-sky-500 text-xs" /> Scheduled 📅
        </span>
      );
    }

    if (st === "active" || st === "in-progress") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs whitespace-nowrap animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Live 🔴
        </span>
      );
    }
    if (st === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs whitespace-nowrap">
          <FaCheckCircle className="text-emerald-500 text-xs" /> Completed ✅
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs whitespace-nowrap">
        <FaClock className="text-amber-500 text-xs" /> Scheduled 📅
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in font-sans selection:bg-indigo-500 selection:text-white transition-all duration-300">
      {/* 1. Page Heading Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20">
        {/* Decorative background blur shapes */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <FaVideo className="text-indigo-400 animate-pulse" />
              <span>Real-Time Code Evaluation Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border border-indigo-400/30 text-indigo-400 flex items-center justify-center text-2xl sm:text-3xl shadow-xl">
                  <FaUserTie />
                </div>
              </div>
              <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                Live Interview Hub
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-2xl leading-relaxed">
              Schedule 1-on-1 interactive coding rounds, monitor socket connections, run live code, control timers, and provide candidate ratings in real-time.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="group relative inline-flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 cursor-pointer border border-white/20 shrink-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Schedule Live Interview</span>
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: "Total Sessions",
            count: totalCount,
            bg: "bg-gradient-to-br from-indigo-900/90 via-indigo-950/80 to-slate-950 border-indigo-500/40 text-white shadow-indigo-500/10",
            subtext: "All-time rooms",
            iconBg: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
            icon: <FaVideo className="text-indigo-400" />,
            textColor: "text-indigo-200",
            countColor: "text-white",
          },
          {
            label: "Upcoming",
            count: upcomingCount,
            bg: "bg-gradient-to-br from-amber-950/80 via-amber-900/40 to-slate-950 border-amber-500/40 text-amber-100 shadow-amber-500/10",
            subtext: "Awaiting start",
            iconBg: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
            icon: <FaUserClock className="text-amber-400" />,
            textColor: "text-amber-300/80",
            countColor: "text-amber-400",
          },
          {
            label: "Live",
            count: liveCount,
            bg: "bg-gradient-to-br from-rose-950/90 via-rose-900/50 to-slate-950 border-rose-500/50 text-rose-100 shadow-rose-500/20",
            subtext: "Active in progress",
            iconBg: "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse",
            icon: <FaPlay className="text-rose-400 text-xs" />,
            textColor: "text-rose-300/80",
            countColor: "text-rose-400",
          },
          {
            label: "Completed",
            count: completedCount,
            bg: "bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-slate-950 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10",
            subtext: "Submitted rounds",
            iconBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
            icon: <FaUserCheck className="text-emerald-400" />,
            textColor: "text-emerald-300/80",
            countColor: "text-emerald-400",
          },
          {
            label: "Cancelled",
            count: cancelledCount,
            bg: "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-slate-700/60 text-slate-200 shadow-slate-950/20",
            subtext: "Closed rooms",
            iconBg: "bg-slate-800 text-slate-400 border border-slate-700",
            icon: <FaBan className="text-slate-400" />,
            textColor: "text-slate-400",
            countColor: "text-slate-200",
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl border ${m.bg} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider ${m.textColor}`}>
                {m.label}
              </span>
              <div className={`p-2 rounded-xl text-sm ${m.iconBg} group-hover:scale-110 transition-transform shadow-inner`}>
                {m.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-3xl sm:text-4xl font-black tracking-tight ${m.countColor}`}>
                {m.count}
              </span>
              <p className={`text-[10px] font-semibold ${m.textColor} mt-1 opacity-80`}>
                {m.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-auto p-1">
          {[
            { id: "all", label: "All Sessions", count: totalCount },
            { id: "upcoming", label: "Upcoming", count: upcomingCount },
            { id: "live", label: "Live", count: liveCount },
            { id: "completed", label: "Completed", count: completedCount },
            { id: "cancelled", label: "Cancelled", count: cancelledCount },
          ].map((tab) => {
            const isActive = activeStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, email, role or room ID..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* 4. INTERVIEWS TABLE / LIST */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-lg space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <FaVideo className="absolute text-indigo-600 text-sm animate-pulse" />
          </div>
          <p className="text-xs font-extrabold tracking-wider uppercase text-slate-400">
            Syncing Live Interview Rooms...
          </p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-14 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
            <FaMagic />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            No Interview Rooms Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            No sessions match your search or filter criteria. Create a new 1-on-1 live session to start interviewing.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <FaPlus />
            <span>Schedule New Interview</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5 whitespace-nowrap">Room ID</th>
                  <th className="py-4 px-5 whitespace-nowrap">Candidate</th>
                  <th className="py-4 px-5 whitespace-nowrap">Interviewer</th>
                  <th className="py-4 px-5 whitespace-nowrap">Status</th>
                  <th className="py-4 px-5 whitespace-nowrap">Schedule & Duration</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filteredRooms.map((rm) => {
                  const st = (rm.status || "").toLowerCase();
                  const candConn =
                    rm.candidateConnected ??
                    (st === "active" || st === "in-progress" || st === "waiting");
                  const intConn =
                    rm.interviewerConnected ??
                    (st === "active" || st === "in-progress" || st === "waiting");
                  const isCopied = copiedRoomId === rm.roomId;

                  return (
                    <tr
                      key={rm.roomId}
                      className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all duration-200 group"
                    >
                      {/* ROOM ID */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800/60">
                            {rm.roomId}
                          </span>
                          <button
                            onClick={(e) => copyRoomId(rm.roomId, e)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition cursor-pointer"
                            title="Copy Room ID"
                          >
                            {isCopied ? (
                              <FaCheck className="text-emerald-500 text-xs" />
                            ) : (
                              <FaCopy className="text-xs" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* CANDIDATE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {rm.candidateName || "Candidate"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {rm.candidateEmail}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {candConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Offline
                            </span>
                          )}
                        </div>
                      </td>

                      {/* INTERVIEWER STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {rm.interviewerName || "Rahul (Admin)"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Role: {rm.role || "MERN Developer"}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {intConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Offline
                            </span>
                          )}
                        </div>
                      </td>

                      {/* LIVE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {renderStatusBadge(rm.status, rm)}
                      </td>

                      {/* START TIME & DURATION */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <FaCalendarAlt className="text-indigo-500 text-xs" />
                          <span>{rm.scheduledDate || "Today"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <FaClock className="text-amber-500 text-[11px]" />
                          <span>{rm.scheduledTime || "03:00 PM"}</span>
                          <span className="font-mono text-indigo-500 font-bold ml-1">
                            ({rm.duration || 30}m)
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* ENTER ROOM BUTTON */}
                          <button
                            onClick={() =>
                              navigate(`/admin/interview-room/${rm.roomId}`)
                            }
                            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
                            title="Enter Live Interview Room"
                          >
                            <FaPlay className="text-[10px]" />
                            <span>Enter Room</span>
                          </button>

                          {/* MONITOR DETAILS BUTTON */}
                          <button
                            onClick={() => setSelectedRoomDetails(rm)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-bold rounded-xl transition cursor-pointer inline-flex items-center justify-center border border-slate-200 dark:border-slate-700"
                            title="Monitor Room Telemetry"
                          >
                            <FaEye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          </button>

                          {/* CANCEL BUTTON */}
                          {rm.status !== "cancelled" &&
                            rm.status !== "Cancelled" && (
                              <button
                                onClick={() => setCancelModalRoom(rm)}
                                className="p-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
                                title="Cancel Interview Session"
                              >
                                <FaBan className="w-3.5 h-3.5" />
                              </button>
                            )}

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleDeleteRoom(rm.roomId)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 border border-slate-200 dark:border-slate-700 font-bold rounded-xl transition cursor-pointer flex items-center justify-center shadow-xs"
                            title="Delete Interview Room"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SCHEDULE / CREATE INTERVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col p-6 shadow-2xl my-auto transform transition-all scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                  <FaUserTie className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Schedule Live Interview
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Set candidate parameters and code question set
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleCreateRoom}
              className="space-y-4 text-xs font-semibold overflow-y-auto pr-1 flex-1"
            >
              {/* Select User Dropdown */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                  Select Candidate User
                </label>
                <select
                  value={candidateEmail}
                  onChange={(e) => handleSelectUser(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
                >
                  {userOptions.map((u, i) => (
                    <option key={i} value={u.email}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Candidate Display Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Interviewer Name
                  </label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Job Role / Position
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    placeholder="e.g. Senior MERN Developer"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Interview Category
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
                  >
                    <option value="Technical">💡 Technical Interview</option>
                    <option value="Coding">💻 Coding Challenge</option>
                    <option value="System Design">🏗️ System Design</option>
                    <option value="HR">🤝 HR Interview</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Time
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="03:00 PM"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1.5">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
                  />
                </div>
              </div>

              {/* QUESTIONS BUILDER */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 dark:text-slate-200 font-black block text-xs uppercase tracking-wider">
                    Question Set ({questionsList.length})
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => addQuestion("Technical")}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <FaLightbulb className="text-[11px]" />
                      <span>+ Technical</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion("Coding")}
                      className="px-3 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-xs font-bold rounded-xl border border-sky-500/30 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <FaCode className="text-[11px]" />
                      <span>+ Coding</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
                  {questionsList.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-2xl border ${
                        q.type === "Coding"
                          ? "bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800"
                          : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                      } space-y-2 relative shadow-xs`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                            q.type === "Coding"
                              ? "bg-sky-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}
                        >
                          Q{idx + 1}: {q.type}
                        </span>

                        {questionsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(q.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition cursor-pointer"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <textarea
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(q.id, "question", e.target.value)
                        }
                        rows={2}
                        required
                        className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 shrink-0 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Create & Launch Session</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. VIEW & MONITOR DETAILS MODAL */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                  <FaEye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Live Interview Monitor
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Real-time connection telemetry for Room{" "}
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {selectedRoomDetails.roomId}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {/* CONNECTION HEALTH ALERT BANNER */}
              {(() => {
                const st = (selectedRoomDetails.status || "").toLowerCase();
                const candConn =
                  selectedRoomDetails.candidateConnected ??
                  (st === "active" || st === "in-progress" || st === "waiting");
                const intConn =
                  selectedRoomDetails.interviewerConnected ??
                  (st === "active" || st === "in-progress" || st === "waiting");
                const hasConnError =
                  (st === "active" || st === "in-progress") &&
                  (!candConn || !intConn);

                if (hasConnError) {
                  return (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                      <FaExclamationTriangle className="text-amber-500 text-base shrink-0 animate-bounce" />
                      <span>
                        ⚠️ Socket issue detected: Session is active but candidate/interviewer appears disconnected.
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">
                    Candidate Telemetry
                  </span>
                  <div>
                    {(selectedRoomDetails.candidateConnected ?? true) ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">
                    Interviewer Telemetry
                  </span>
                  <div>
                    {(selectedRoomDetails.interviewerConnected ?? true) ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Live Status</span>
                <span>{renderStatusBadge(selectedRoomDetails.status)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Candidate</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedRoomDetails.candidateName} ({selectedRoomDetails.candidateEmail})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Interviewer</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedRoomDetails.interviewerName || "Rahul (Admin)"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Schedule</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  🕒 {selectedRoomDetails.scheduledTime || "03:00 PM"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Session Duration</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  ⏱️ {selectedRoomDetails.duration || 30} Minutes
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const id = selectedRoomDetails.roomId;
                  setSelectedRoomDetails(null);
                  navigate(`/admin/interview-room/${id}`);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <FaPlay className="text-xs" />
                <span>Join Session</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const id = selectedRoomDetails.roomId;
                    setSelectedRoomDetails(null);
                    handleDeleteRoom(id);
                  }}
                  className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl hover:bg-rose-600 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FaTrash className="text-xs" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedRoomDetails(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. CANCEL MODAL */}
      {cancelModalRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <FaBan />
              <span>Cancel Interview Session</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to cancel the interview for{" "}
              <strong className="text-slate-900 dark:text-white">
                {cancelModalRoom.candidateName}
              </strong>{" "}
              (Room ID: <span className="font-mono text-indigo-600">{cancelModalRoom.roomId}</span>)?
            </p>
            <form onSubmit={handleCancelRoom} className="space-y-3">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Provide a reason for cancellation..."
                rows={3}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalRoom(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveInterviews;
