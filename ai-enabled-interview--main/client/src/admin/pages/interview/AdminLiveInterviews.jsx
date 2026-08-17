import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLiveInterviewRooms, createLiveInterviewRoom, endLiveInterviewRoom } from "../../../services/liveInterviewService";
import { FaUserTie, FaPlus, FaPlay, FaClock, FaCommentDots, FaCheckCircle, FaTrash, FaExternalLinkAlt, FaCode, FaLightbulb } from "react-icons/fa";

const AdminLiveInterviews = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("Technical Live Interview - Admin Session");
  const [candidateName, setCandidateName] = useState("Priyanshu");
  const [candidateEmail, setCandidateEmail] = useState("priyanshu@gmail.com");
  const [interviewerName, setInterviewerName] = useState("Admin Interviewer");
  const [question, setQuestion] = useState("Explain Redis caching strategies and write an LRU cache implementation.");
  const [timerSeconds, setTimerSeconds] = useState(1800);
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
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createLiveInterviewRoom({
        title,
        candidateName,
        candidateEmail,
        interviewerName,
        questions: questionsList,
        duration: Number(timerSeconds) / 60,
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

  const handleEndRoom = async (roomId) => {
    try {
      await endLiveInterviewRoom(roomId);
      fetchRooms();
    } catch (err) {
      console.error("Error closing room:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in font-sans">
      {/* 1. Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
              <FaUserTie />
            </div>
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Real-Time Interview Rooms (Admin Panel)
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
            Monitor active 1-on-1 live coding rooms, join as an Interviewer, manage timers, and push real-time questions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/20"
        >
          <FaPlus />
          <span>Create Live Room</span>
        </button>
      </div>

      {/* 2. Room Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs tracking-wider uppercase font-bold text-slate-400">Loading active rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-14 text-center shadow-lg">
          <p className="text-slate-600 font-bold text-base">No active live interview rooms right now.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Launch First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-indigo-400/80 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1 rounded-full font-bold">
                    ID: {room.roomId}
                  </span>
                  <span
                    className={`text-[11px] px-3 py-1 rounded-full font-extrabold border ${
                      room.status === "In-Progress" || room.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : room.status === "Completed" || room.status === "completed"
                        ? "bg-purple-50 text-purple-700 border-purple-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    🟢 {room.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
                  {room.title || room.role || "Technical Interview"}
                </h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-4">
                  Candidate: <strong className="text-slate-800 font-semibold">{room.candidateEmail || room.candidateName}</strong>
                </p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 space-y-2 text-xs font-semibold text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Candidate Name:</span>
                    <span className="text-slate-800 font-bold">{room.candidateName || "Priyanshu"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interviewer:</span>
                    <span className="text-slate-800 font-bold">{room.interviewerName || "Admin"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/admin/interview-room/${room.roomId}`)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  <span>Join as Interviewer</span>
                </button>
                {room.status !== "Completed" && room.status !== "completed" && (
                  <button
                    onClick={() => handleEndRoom(room.roomId)}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    title="End Session"
                  >
                    End
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h2 className="text-xl font-black text-slate-800">Create Live Interview Room (Admin)</h2>
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
                <label className="text-slate-700 font-bold block mb-1">Session Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Target Candidate Email (Only this user gets invited)</label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="e.g. candidate@example.com"
                  required
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                />
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

              {/* MULTI-TYPE QUESTIONS BUILDER */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold block text-xs uppercase tracking-wider">
                    Interview Questions ({questionsList.length})
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => addQuestion("Technical")}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1.5 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaLightbulb className="text-[11px]" />
                      <span>+ Technical Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion("Coding")}
                      className="px-3 py-1.5 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 text-xs font-bold rounded-xl border border-sky-500/30 flex items-center space-x-1.5 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaCode className="text-[11px]" />
                      <span>+ Coding Question</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {questionsList.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        q.type === "Coding"
                          ? "bg-sky-50/60 border-sky-200"
                          : "bg-amber-50/60 border-amber-200"
                      } space-y-2.5 relative group shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm ${
                            q.type === "Coding"
                              ? "bg-sky-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}
                        >
                          {q.type === "Coding" ? <FaCode /> : <FaLightbulb />}
                          Q{idx + 1}: {q.type} Question
                        </span>

                        {questionsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(q.id)}
                            className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-100/50 transition cursor-pointer"
                            title="Remove Question"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>

                      <textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                        placeholder={
                          q.type === "Coding"
                            ? "Describe the live coding task/algorithm..."
                            : "Enter the technical theory question..."
                        }
                        rows={2}
                        required
                        className="w-full bg-white text-slate-800 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      {q.type === "Coding" && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 block">
                            Optional Starter Code Template
                          </span>
                          <textarea
                            value={q.initialCode}
                            onChange={(e) => updateQuestion(q.id, "initialCode", e.target.value)}
                            placeholder="// Code template to load into candidate's editor"
                            rows={3}
                            className="w-full bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-xl border border-slate-700 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Session Duration (Seconds)</label>
                <input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
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
                  className="px-7 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Launching Session..." : "Launch Session"}
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
