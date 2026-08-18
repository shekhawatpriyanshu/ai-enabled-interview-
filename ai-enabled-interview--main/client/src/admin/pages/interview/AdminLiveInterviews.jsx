import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLiveInterviewRooms, createLiveInterviewRoom, endLiveInterviewRoom, cancelLiveInterviewRoom, deleteLiveInterviewRoom } from "../../../services/liveInterviewService";
import { getUsers } from "../../services/userService";
import socket from "../../../socket";
import {
  FaUserTie,
  FaPlus,
  FaPlay,
  FaClock,
  FaCheckCircle,
  FaTrash,
  FaExternalLinkAlt,
  FaCode,
  FaLightbulb,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaEye,
  FaBan,
  FaChartLine,
  FaExclamationTriangle,
  FaWifi,
  FaQuestionCircle,
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

  // Filters & Search
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [interviewerName, setInterviewerName] = useState("Rahul (Admin)");
  const [role, setRole] = useState("MERN Developer");
  const [interviewType, setInterviewType] = useState("Technical");
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [scheduledTime, setScheduledTime] = useState("03:00 PM");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [creating, setCreating] = useState(false);

  const [questionsList, setQuestionsList] = useState([
    {
      id: "1",
      type: "Technical",
      question: "Explain the difference between JWT authentication and session authentication.",
      initialCode: "",
    },
    {
      id: "2",
      type: "Coding",
      question: "Write an LRU Cache implementation in JavaScript with get() and put() methods.",
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
      question: type === "Technical" ? "Explain..." : "Write a function to solve...",
      initialCode: type === "Coding" ? "function solution() {\n  // Code here\n}\n" : "",
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
      setLoading(true);
      const res = await getLiveInterviewRooms();
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (err) {
      console.error("Error fetching live rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    socket.emit("join_admin_dashboard");

    socket.on("candidate_joined", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, candidateConnected: true, status: r.status === "scheduled" ? "waiting" : r.status } : r
        )
      );
    });

    socket.on("candidate_left", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, candidateConnected: false } : r))
      );
    });

    socket.on("interview_started", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, status: "In-Progress", interviewerConnected: true } : r))
      );
    });

    socket.on("interview_ended", ({ roomId }) => {
      setRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, status: "Completed" } : r))
      );
    });

    socket.on("room_status_updated", () => {
      fetchRooms();
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("candidate_left");
      socket.off("interview_started");
      socket.off("interview_ended");
      socket.off("room_status_updated");
    };
  }, []);

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
    if (!window.confirm(`Are you sure you want to permanently delete interview room ${roomId}?`)) {
      return;
    }
    try {
      await deleteLiveInterviewRoom(roomId);
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert("Failed to delete interview room: " + (err.response?.data?.message || err.message));
    }
  };

  // Metrics
  const totalCount = rooms.length;
  const upcomingCount = rooms.filter((r) => r.status === "scheduled" || r.status === "Scheduled" || r.status === "waiting" || r.status === "Waiting").length;
  const liveCount = rooms.filter((r) => r.status === "active" || r.status === "In-Progress").length;
  const completedCount = rooms.filter((r) => r.status === "completed" || r.status === "Completed").length;
  const cancelledCount = rooms.filter((r) => r.status === "cancelled" || r.status === "Cancelled").length;

  const filteredRooms = rooms.filter((r) => {
    const matchesStatus =
      activeStatusFilter === "all" ||
      (activeStatusFilter === "upcoming" && (r.status === "scheduled" || r.status === "waiting")) ||
      (activeStatusFilter === "live" && (r.status === "active" || r.status === "In-Progress")) ||
      (activeStatusFilter === "completed" && (r.status === "completed" || r.status === "Completed")) ||
      (activeStatusFilter === "cancelled" && (r.status === "cancelled" || r.status === "Cancelled"));

    const matchesSearch =
      (r.candidateName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.candidateEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.roomId || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const renderStatusBadge = (status) => {
    const st = (status || "").toLowerCase();
    if (st === "active" || st === "in-progress") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold rounded-full bg-rose-50 text-rose-600 border border-rose-200 shadow-sm whitespace-nowrap animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600" /> Live 🔴
        </span>
      );
    }
    if (st === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm whitespace-nowrap">
          Completed ✅
        </span>
      );
    }
    if (st === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200 shadow-sm whitespace-nowrap">
          Cancelled ❌
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm whitespace-nowrap">
        Scheduled 🟡
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
              <FaUserTie />
            </div>
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Interview Management Dashboard
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
            Schedule live 1-on-1 sessions, monitor candidate code stream, control timers, and evaluate candidates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/20"
        >
          <FaPlus />
          <span>Schedule Live Interview</span>
        </button>
      </div>

      {/* 2. DASHBOARD METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Sessions", count: totalCount, color: "from-slate-800 to-slate-900", text: "text-white" },
          { label: "Upcoming 🟡", count: upcomingCount, color: "from-amber-500/10 to-amber-500/20 border-amber-200", text: "text-amber-700" },
          { label: "Live 🔴", count: liveCount, color: "from-rose-500/10 to-rose-500/20 border-rose-200", text: "text-rose-700" },
          { label: "Completed ✅", count: completedCount, color: "from-emerald-500/10 to-emerald-500/20 border-emerald-200", text: "text-emerald-700" },
          { label: "Cancelled ❌", count: cancelledCount, color: "from-slate-200 to-slate-300", text: "text-slate-700" },
        ].map((m, idx) => (
          <div key={idx} className={`p-5 rounded-3xl border bg-gradient-to-br ${m.color} shadow-sm flex flex-col justify-between`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{m.label}</span>
            <span className={`text-2xl sm:text-3xl font-black mt-2 ${m.text}`}>{m.count}</span>
          </div>
        ))}
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-auto">
          {[
            { id: "all", label: "All Sessions" },
            { id: "upcoming", label: "Upcoming 🟡" },
            { id: "live", label: "Live 🔴" },
            { id: "completed", label: "Completed ✅" },
            { id: "cancelled", label: "Cancelled ❌" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusFilter(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition cursor-pointer shrink-0 ${
                activeStatusFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, role or room ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-800 text-xs font-semibold rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 4. INTERVIEWS TABLE / CARDS LIST */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs tracking-wider uppercase font-bold text-slate-400">Loading interview sessions...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-14 text-center shadow-lg">
          <p className="text-slate-600 font-bold text-base">No interview sessions match the current criteria.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Schedule New Interview
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-4 px-5 whitespace-nowrap">Room ID</th>
                  <th className="py-4 px-5 whitespace-nowrap">Candidate Status</th>
                  <th className="py-4 px-5 whitespace-nowrap">Interviewer Status</th>
                  <th className="py-4 px-5 whitespace-nowrap">Live Status</th>
                  <th className="py-4 px-5 whitespace-nowrap">Start Time & Duration</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredRooms.map((rm) => {
                  const st = (rm.status || "").toLowerCase();
                  const candConn = rm.candidateConnected ?? (st === "active" || st === "in-progress" || st === "waiting");
                  const intConn = rm.interviewerConnected ?? (st === "active" || st === "in-progress" || st === "waiting");

                  return (
                    <tr key={rm.roomId} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-5 font-mono font-bold text-indigo-600 whitespace-nowrap">{rm.roomId}</td>

                      {/* CANDIDATE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{rm.candidateName || "Candidate"}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {candConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🟢 Candidate Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              ⚠️ Disconnected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* INTERVIEWER STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{rm.interviewerName || "Rahul (Admin)"}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {intConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🟢 Interviewer Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              ⚠️ Disconnected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* LIVE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {renderStatusBadge(rm.status)}
                      </td>

                      {/* START TIME & DURATION */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <FaClock className="text-amber-500 text-[11px]" />
                          <span>Start: {rm.scheduledTime || "03:00 PM"}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          ⏱️ Duration: {rm.duration || 30} mins
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedRoomDetails(rm)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1"
                            title="Monitor Room Status"
                          >
                            <FaEye className="w-3 h-3 text-indigo-600" />
                            <span>Monitor</span>
                          </button>

                          {rm.status !== "cancelled" && rm.status !== "Cancelled" && (
                            <button
                              onClick={() => setCancelModalRoom(rm)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
                              title="Cancel Interview"
                            >
                              <FaBan className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteRoom(rm.roomId)}
                            className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 font-bold rounded-xl transition cursor-pointer flex items-center justify-center shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-xl font-black text-slate-800">Schedule Live Interview (Admin)</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded-xl hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-semibold overflow-y-auto pr-2 flex-1">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Select Candidate (User)</label>
                <select
                  value={candidateEmail}
                  onChange={(e) => handleSelectUser(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {userOptions.map((u, i) => (
                    <option key={i} value={u.email}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Interviewer Name</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    placeholder="e.g. MERN Developer"
                    className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="text-slate-700 font-bold block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="03:00 PM"
                    required
                    className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                    className="w-full bg-slate-50 text-slate-800 p-3 rounded-2xl border border-slate-300 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* QUESTIONS BUILDER */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold block text-xs uppercase tracking-wider">
                    Question Set ({questionsList.length})
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => addQuestion("Technical")}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <FaLightbulb className="text-[11px]" />
                      <span>+ Technical</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion("Coding")}
                      className="px-3 py-1.5 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 text-xs font-bold rounded-xl border border-sky-500/30 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <FaCode className="text-[11px]" />
                      <span>+ Coding</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {questionsList.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-2xl border ${
                        q.type === "Coding" ? "bg-sky-50/60 border-sky-200" : "bg-amber-50/60 border-amber-200"
                      } space-y-2 relative shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                            q.type === "Coding" ? "bg-sky-600 text-white" : "bg-amber-600 text-white"
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
                        onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                        rows={2}
                        required
                        className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 mt-4 shrink-0 bg-white sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-7 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Scheduling..." : "Create & Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. VIEW & MONITOR DETAILS MODAL */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FaEye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">🔴 Live Interview Monitor</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Real-time status breakdown for Room {selectedRoomDetails.roomId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRoomDetails(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              {/* CONNECTION HEALTH ALERT BANNER */}
              {(() => {
                const st = (selectedRoomDetails.status || "").toLowerCase();
                const candConn = selectedRoomDetails.candidateConnected ?? (st === "active" || st === "in-progress" || st === "waiting");
                const intConn = selectedRoomDetails.interviewerConnected ?? (st === "active" || st === "in-progress" || st === "waiting");
                const hasConnError = (st === "active" || st === "in-progress") && (!candConn || !intConn);

                if (hasConnError) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-amber-800 font-bold">
                      <FaExclamationTriangle className="text-amber-600 text-base shrink-0 animate-bounce" />
                      <span>⚠️ Warning: Connection problems detected during active interview session.</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Connection</span>
                  <div className="mt-1">
                    {(selectedRoomDetails.candidateConnected ?? true) ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1">
                        🟢 Candidate Connected
                      </span>
                    ) : (
                      <span className="text-amber-700 font-black flex items-center gap-1">
                        ⚠️ Candidate Disconnected
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviewer Connection</span>
                  <div className="mt-1">
                    {(selectedRoomDetails.interviewerConnected ?? true) ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1">
                        🟢 Interviewer Connected
                      </span>
                    ) : (
                      <span className="text-amber-700 font-black flex items-center gap-1">
                        ⚠️ Interviewer Disconnected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Live Status</span>
                <span>{renderStatusBadge(selectedRoomDetails.status)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Candidate</span>
                <span className="font-bold">{selectedRoomDetails.candidateName} ({selectedRoomDetails.candidateEmail})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Interviewer</span>
                <span className="font-bold">{selectedRoomDetails.interviewerName || "Rahul (Admin)"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Start Time</span>
                <span className="font-bold">🕒 {selectedRoomDetails.scheduledTime || "03:00 PM"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Session Duration</span>
                <span className="font-bold text-slate-900 font-mono">⏱️ {selectedRoomDetails.duration || 30} Minutes</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const id = selectedRoomDetails.roomId;
                  setSelectedRoomDetails(null);
                  handleDeleteRoom(id);
                }}
                className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl hover:bg-rose-600 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <FaTrash className="text-xs" />
                <span>Delete Room</span>
              </button>

              <button
                onClick={() => setSelectedRoomDetails(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CANCEL MODAL */}
      {cancelModalRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-rose-600">Cancel Interview Session</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel the interview for <strong className="text-slate-900">{cancelModalRoom.candidateName}</strong> ({cancelModalRoom.roomId})?
            </p>
            <form onSubmit={handleCancelRoom} className="space-y-3">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={2}
                required
                className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalRoom(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Cancel
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
