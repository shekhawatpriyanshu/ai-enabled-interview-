import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";
import { Radio, Clock, Video, X, CheckCircle } from "lucide-react";

export default function LiveInterviewInvitationModal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userEmail = user?.email || "priyanshu@gmail.com";

  const [invitation, setInvitation] = useState(null);
  const [timerRemaining, setTimerRemaining] = useState(30);

  useEffect(() => {
    if (userEmail) {
      socket.emit("register_user_email", userEmail);
    }

    const handleInvitation = (data) => {
      setInvitation(data);
      setTimerRemaining(30);

      // Save notification to persistent localStorage
      try {
        const cached = localStorage.getItem("user_interview_notifications");
        const notifications = cached ? JSON.parse(cached) : [];
        const newNotif = {
          id: `notif_${Date.now()}`,
          roomId: data.roomId,
          role: data.role || "MERN Developer",
          interviewerName: data.interviewerName || "Admin",
          message: data.message || `Admin created Live Interview (${data.roomId})`,
          createdAt: new Date().toISOString(),
          read: false,
        };

        // Filter duplicates and prepend
        const updated = [newNotif, ...notifications.filter((n) => n.roomId !== data.roomId)].slice(0, 20);
        localStorage.setItem("user_interview_notifications", JSON.stringify(updated));
        window.dispatchEvent(new Event("new_interview_notification"));
      } catch (err) {
        console.error("Save notification error:", err);
      }
    };

    socket.on("live_interview_invitation", handleInvitation);

    return () => {
      socket.off("live_interview_invitation", handleInvitation);
    };
  }, [userEmail]);

  useEffect(() => {
    if (!invitation) return;

    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setInvitation(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation]);

  if (!invitation) return null;

  const handleJoin = () => {
    const targetRoomId = invitation.roomId;
    setInvitation(null);
    navigate(`/interview-room/${targetRoomId}`);
  };

  const handleDecline = () => {
    setInvitation(null);
  };

  const progressPercent = (timerRemaining / 30) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-90 md:w-96 shadow-2xl animate-fade-in font-sans selection:bg-sky-500 selection:text-white">
      <div className="bg-[#0b0f1d]/95 backdrop-blur-2xl border border-sky-500/50 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden ring-1 ring-sky-500/30">
        {/* TOP TIMER PROGRESS BAR */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 h-full transition-all duration-1000 ease-linear shadow-lg shadow-sky-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 animate-pulse shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[9px] font-black uppercase tracking-wider">
                <Radio className="w-2.5 h-2.5 animate-ping text-sky-400" />
                <span>Live Interview Toast (30s)</span>
              </div>
              <h3 className="text-sm font-black text-white mt-1 tracking-tight">
                Live Interview Invitation!
              </h3>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Position:</span>
            <span className="text-white font-bold">{invitation.role || "MERN Developer"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Room ID:</span>
            <span className="text-sky-400 font-mono font-bold">{invitation.roomId}</span>
          </div>
        </div>

        {/* COUNTDOWN DISPLAY & ACTION */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span className="font-mono text-xs text-amber-300 font-black">
              00:{timerRemaining < 10 ? `0${timerRemaining}` : timerRemaining}s
            </span>
          </div>

          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-500 hover:from-sky-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-600/30 flex items-center space-x-1.5 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/20"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>JOIN NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
