import { useState, useEffect } from "react";
import { getLiveInterviewRooms, cancelLiveInterviewRoom, deleteLiveInterviewRoom } from "../../../services/liveInterviewService";
import socket from "../../../socket";
import {
  FaUserTie,
  FaClock,
  FaTrash,
  FaSearch,
  FaEye,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminLiveInterviews = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const [cancelModalRoom, setCancelModalRoom] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Filters & Search
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
            Monitor live 1-on-1 candidate code streams, connection health, status tracking, and candidate evaluation management.
          </p>
        </div>
      </div>

      {/* 2. DASHBOARD METRICS CARDS WITH HOVER EFFECTS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { id: "all", label: "Total Sessions", count: totalCount, color: "from-slate-800 to-slate-900", text: "text-white" },
          { id: "upcoming", label: "Upcoming 🟡", count: upcomingCount, color: "from-amber-500/10 to-amber-500/20 border-amber-200/90", text: "text-amber-700" },
          { id: "live", label: "Live 🔴", count: liveCount, color: "from-rose-500/10 to-rose-500/20 border-rose-200/90", text: "text-rose-700" },
          { id: "completed", label: "Completed ✅", count: completedCount, color: "from-emerald-500/10 to-emerald-500/20 border-emerald-200/90", text: "text-emerald-700" },
          { id: "cancelled", label: "Cancelled ❌", count: cancelledCount, color: "from-slate-100 to-slate-200/80 border-slate-300/80", text: "text-slate-700" },
        ].map((m) => (
          <div
            key={m.id}
            onClick={() => setActiveStatusFilter(m.id)}
            className={`p-5 rounded-3xl border bg-gradient-to-br ${m.color} shadow-sm flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-xl cursor-pointer group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-indigo-600 transition-colors">{m.label}</span>
            <span className={`text-2xl sm:text-3xl font-black mt-2 transition-transform duration-300 group-hover:scale-110 ${m.text}`}>{m.count}</span>
          </div>
        ))}
      </div>

      {/* 3. FILTERS & SEARCH BAR WITH HOVER STATES */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
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
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
                activeStatusFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 group">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-xs group-hover:text-indigo-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, role or room ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white text-slate-800 text-xs font-semibold rounded-2xl border border-slate-300 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-2xs hover:shadow-sm"
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
                    <tr key={rm.roomId} className="hover:bg-indigo-50/40 transition-colors duration-200 group">
                      <td className="py-4 px-5 font-mono font-bold text-indigo-600 whitespace-nowrap group-hover:scale-105 transition-transform duration-200 inline-block">{rm.roomId}</td>

                      {/* CANDIDATE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">{rm.candidateName || "Candidate"}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {candConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs group-hover:scale-105 transition-transform">
                              🟢 Candidate Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform">
                              ⚠️ Disconnected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* INTERVIEWER STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">{rm.interviewerName || "Rahul (Admin)"}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {intConn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs group-hover:scale-105 transition-transform">
                              🟢 Interviewer Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform">
                              ⚠️ Disconnected
                            </span>
                          )}
                        </div>
                      </td>

                      {/* LIVE STATUS */}
                      <td className="py-4 px-5 whitespace-nowrap group-hover:scale-105 transition-transform">
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
                            className="px-3.5 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 shadow-2xs hover:shadow-md hover:shadow-indigo-500/25"
                            title="Monitor Room Status"
                          >
                            <FaEye className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white transition-colors" />
                            <span>Monitor</span>
                          </button>

                          {rm.status !== "cancelled" && rm.status !== "Cancelled" && (
                            <button
                              onClick={() => setCancelModalRoom(rm)}
                              className="p-2 bg-rose-50 hover:bg-amber-600 hover:text-white text-rose-600 border border-rose-200 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs hover:shadow-md hover:shadow-amber-500/25"
                              title="Cancel Interview"
                            >
                              <FaBan className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteRoom(rm.roomId)}
                            className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs hover:shadow-md hover:shadow-red-500/25"
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
