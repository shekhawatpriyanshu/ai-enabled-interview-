import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getLiveInterviewRooms } from "../../services/liveInterviewService";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";
import { Radio, Users, Play, ArrowRight, Sparkles, Bell, X, ShieldCheck, Zap } from "lucide-react";

export default function LiveInterviewLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [invitationToast, setInvitationToast] = useState(null);

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

    if (userEmail) {
      socket.emit("register_user_email", userEmail);
    }

    const handleInvitation = (data) => {
      setInvitationToast(data);
      fetchRooms();
    };

    socket.on("live_interview_invitation", handleInvitation);

    return () => {
      socket.off("live_interview_invitation", handleInvitation);
    };
  }, [userEmail]);

  const handleJoinById = (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) return;
    navigate(`/interview-room/${joinRoomId.trim()}`);
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white animate-fade-in">
        {/* REAL-TIME TARGETED INVITATION TOAST BANNER */}
        {invitationToast && (
          <div className="max-w-6xl mx-auto mb-8 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 border border-sky-400/40 p-4 md:p-5 rounded-3xl shadow-2xl shadow-indigo-500/20 flex items-center justify-between animate-bounce transition-all duration-300">
            <div className="flex items-center space-x-3.5 text-white">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                <Bell className="w-6 h-6 text-amber-300 animate-wiggle" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-black tracking-widest text-sky-200 block">
                  🚨 Real-Time Live Interview Request
                </span>
                <p className="text-sm md:text-base font-black tracking-tight">{invitationToast.message || "You have been invited to a Live Interview!"}</p>
                <span className="text-xs text-sky-100 font-mono font-semibold">Room ID: {invitationToast.roomId}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/interview-room/${invitationToast.roomId}`)}
                className="px-6 py-3 bg-white text-indigo-950 hover:bg-slate-100 font-black text-xs rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                JOIN INTERVIEW NOW
              </button>
              <button
                onClick={() => setInvitationToast(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 md:p-12 shadow-xl backdrop-blur-xl group">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all duration-700" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-widest mb-5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-sky-600" />
                  <span>Real-Time Socket.IO Candidate Platform</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Candidate Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Interview Room</span>
                </h1>
                <p className="text-slate-500 text-sm md:text-base mt-2 max-w-2xl font-semibold">
                  Participate in targeted live 1-on-1 technical interviews created specifically for <strong className="text-indigo-600 font-bold">{userEmail}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK JOIN BY ROOM ID */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-400/60 transition-all duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-indigo-600" /> Join Interview Room by Room ID
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Enter the unique Room ID provided in your interview invitation notification.
              </p>
            </div>
            <form onSubmit={handleJoinById} className="flex items-center space-x-3 w-full md:w-auto">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="e.g. ROOM_8F32K"
                className="bg-slate-50 text-slate-800 text-xs font-mono px-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-72 transition-all font-semibold"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-lg shadow-indigo-500/25"
              >
                <span>Join</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ACTIVE / RECENT ROOMS GRID */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center space-x-2.5 tracking-tight">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Your Live Interview Invitations </span>
          </h2>

          {loading ? (
            <div className="text-center py-16 text-slate-500 font-semibold">
              <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs tracking-wider uppercase font-bold text-slate-400">Loading targeted interview sessions...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-14 text-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-bold text-base">No active live interview invitations found for {userEmail}.</p>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold">When an Admin schedules an interview targeting your email, it will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((rm) => (
                <div
                  key={rm.roomId}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1 rounded-full font-bold">
                        ID: {rm.roomId}
                      </span>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {rm.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 mb-2 leading-snug">
                      {rm.role || "Technical Interview"}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-5 font-semibold">
                      Target Candidate: <strong className="text-slate-800">{rm.candidateEmail || userEmail}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700">{rm.interviewerName || "Admin"}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/interview-room/${rm.roomId}`)}
                      className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/20 cursor-pointer"
                    >
                      Join Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
