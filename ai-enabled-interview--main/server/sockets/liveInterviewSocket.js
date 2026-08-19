const LiveInterviewRoom = require("../models/liveInterviewRoom");
const liveInterviewController = require("../controllers/liveInterviewController");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "gsk_placeholder_key_for_server_boot",
});

const activeTimers = new Map();
const roomParticipants = new Map();

const startServerTimer = (io, roomId) => {
  if (activeTimers.has(roomId)) return;

  const interval = setInterval(async () => {
    try {
      const room = await LiveInterviewRoom.findOne({ roomId });
      if (!room || room.status === "completed") {
        const t = activeTimers.get(roomId);
        if (t) clearInterval(t);
        activeTimers.delete(roomId);
        return;
      }

      if (room.timerRemaining > 0) {
        const nextTime = room.timerRemaining - 1;
        await LiveInterviewRoom.updateOne({ roomId }, { timerRemaining: nextTime });
        io.to(roomId).emit("timer_tick", {
          timerRemaining: nextTime,
          status: room.status,
        });
      } else {
        await LiveInterviewRoom.updateOne({ roomId }, { status: "completed", endedAt: new Date() });
        const updatedRoom = await LiveInterviewRoom.findOne({ roomId });
        io.to(roomId).emit("interview_ended", { reason: "Timer expired", room: updatedRoom });
        const t = activeTimers.get(roomId);
        if (t) clearInterval(t);
        activeTimers.delete(roomId);
      }
    } catch (err) {
      console.error("Timer tick error:", err.message);
    }
  }, 1000);

  activeTimers.set(roomId, interval);
};

const stopServerTimer = (roomId) => {
  if (activeTimers.has(roomId)) {
    clearInterval(activeTimers.get(roomId));
    activeTimers.delete(roomId);
  }
};

module.exports = function initLiveInterviewSocket(io) {
  io.on("connection", (socket) => {
    let currentRoomId = null;
    let currentUserRole = null;
    let currentUserName = null;

    socket.on("register_user_email", (email) => {
      if (email) {
        socket.join(`user:${email.trim().toLowerCase()}`);
      }
    });

    // Join Socket Room
    const handleJoinRoom = async ({ roomId, role, userName, userEmail }) => {
      currentRoomId = roomId;
      let room = await LiveInterviewRoom.findOne({ roomId });

      if (room && userEmail) {
        const uClean = userEmail.trim().toLowerCase();
        const hostClean = (room.hostEmail || room.creatorEmail || "").trim().toLowerCase();
        const candClean = (room.candidateEmail || "").trim().toLowerCase();

        if (hostClean && uClean === hostClean) {
          currentUserRole = "Interviewer";
          currentUserName = room.interviewerName || userName || "Shree (Host)";
        } else if (candClean && uClean === candClean) {
          currentUserRole = "Candidate";
          currentUserName = room.candidateName || userName || "Shivuu";
        } else {
          currentUserRole = role || "Candidate";
          currentUserName = userName || "User";
        }
      } else {
        currentUserRole = role || "Candidate";
        currentUserName = userName || (role === "Interviewer" ? "Shree (Host)" : "Shivuu");
      }

      socket.join(roomId);

      if (userEmail) {
        socket.join(`user:${userEmail.trim().toLowerCase()}`);
      }

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map());
      }
      roomParticipants.get(roomId).set(socket.id, {
        role: currentUserRole,
        userName: currentUserName,
      });

      const participants = Array.from(roomParticipants.get(roomId).values());
      const hasAdmin = participants.some((p) => p.role === "Admin" || p.role === "Interviewer");
      const hasCandidate = participants.some((p) => p.role === "Candidate");

      if (!room) {
        try {
          room = await LiveInterviewRoom.findOneAndUpdate(
            { roomId },
            {
              $setOnInsert: {
                roomId,
                candidateName: currentUserRole === "Candidate" ? currentUserName : "Shivuu",
                interviewerName: currentUserRole === "Interviewer" ? currentUserName : "Shree (Host)",
                status: "waiting",
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (e) {
          room = await LiveInterviewRoom.findOne({ roomId });
        }
      }

function checkIsTimeReached(scheduledDate, scheduledTime) {
  if (!scheduledDate || !scheduledTime) return true;
  try {
    let dateStr = scheduledDate;
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0];
    }
    let timeStr = String(scheduledTime).trim();
    let isPM = /pm/i.test(timeStr);
    let isAM = /am/i.test(timeStr);
    let cleanTime = timeStr.replace(/(am|pm)/i, "").trim();
    let [hoursStr, minutesStr] = cleanTime.split(":");
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10) || 0;

    if (isNaN(hours)) return true;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const pad = (n) => String(n).padStart(2, "0");
    const scheduledMoment = new Date(`${dateStr}T${pad(hours)}:${pad(minutes)}:00`);
    if (isNaN(scheduledMoment.getTime())) return true;

    return new Date() >= scheduledMoment;
  } catch {
    return true;
  }
}

      // Activate room status only if scheduled time has arrived or interview started
      const isTimeReached = checkIsTimeReached(room.scheduledDate, room.scheduledTime);

      if (room.status !== "completed" && room.status !== "cancelled") {
        if (isTimeReached && room.status !== "active") {
          room.status = "active";
          room.startedAt = room.startedAt || new Date();
          await room.save();
          io.to(roomId).emit("interview_started", { room, roomId });
        }
        if (room.status === "active") {
          startServerTimer(io, roomId);
        }
      }

      // Broadcast candidate_joined event to room
      io.to(roomId).emit("candidate_joined", {
        candidateName: room.candidateName,
        interviewerName: room.interviewerName,
        status: (hasAdmin && hasCandidate) ? "Connected" : (hasAdmin || hasCandidate ? "Waiting Partner" : "Offline"),
        hasAdmin,
        hasCandidate,
        participants,
      });

      socket.emit("room_state", room);
      console.log(`Socket ${socket.id} (${currentUserName} - ${currentUserRole}) joined room: ${roomId} (Timer Active: ${hasAdmin && hasCandidate})`);
    };

    socket.on("join_room", handleJoinRoom);
    socket.on("join_interview", handleJoinRoom);

    // Admin starts interview
    socket.on("start_interview", async ({ roomId }) => {
      try {
        const room = await LiveInterviewRoom.findOneAndUpdate(
          { roomId },
          { status: "active", startedAt: new Date() },
          { new: true }
        );
        startServerTimer(io, roomId);
        io.to(roomId).emit("interview_started", {
          startedAt: room.startedAt,
          duration: room.duration * 60,
          room,
        });
      } catch (err) {
        console.error("Start interview error:", err.message);
      }
    });

    // Admin Timer Controls (Start / Pause / Reset)
    socket.on("timer_control", async ({ roomId, action, durationMinutes }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      try {
        const room = await LiveInterviewRoom.findOne({ roomId: targetRoom });
        if (!room) return;

        if (action === "pause" || action === "stop") {
          stopServerTimer(targetRoom);
          room.status = "waiting";
          await room.save();
          io.to(targetRoom).emit("timer_paused", { timerRemaining: room.timerRemaining });
        } else if (action === "start" || action === "resume") {
          room.status = "active";
          await room.save();
          startServerTimer(io, targetRoom);
          io.to(targetRoom).emit("timer_resumed", { timerRemaining: room.timerRemaining });
        } else if (action === "reset") {
          const resetSecs = (durationMinutes || room.duration || 30) * 60;
          room.timerRemaining = resetSecs;
          await room.save();
          io.to(targetRoom).emit("timer_tick", { timerRemaining: resetSecs, status: room.status });
        }
      } catch (err) {
        console.error("Timer control error:", err.message);
      }
    });

    // Candidate accepts live room invitation
    socket.on("candidate_accepted_invite", async ({ roomId, candidateName, candidateEmail }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      try {
        const room = await LiveInterviewRoom.findOne({ roomId: targetRoom });
        if (room) {
          room.status = "active";
          await room.save();
        }

        const payload = {
          roomId: targetRoom,
          candidateName: candidateName || room?.candidateName || "Candidate",
          candidateEmail: candidateEmail || room?.candidateEmail,
        };

        io.to(targetRoom).emit("candidate_accepted_invite", payload);
        io.emit("candidate_accepted_invite", payload);
      } catch (err) {
        console.error("Candidate accept invite error:", err.message);
      }
    });

    // Candidate or Admin changes code editor language
    socket.on("language_changed", ({ roomId, language }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;
      socket.to(targetRoom).emit("language_updated", { language });
    });

    // Admin sends question to candidate
    socket.on("send_question", async ({ roomId, questionId, question, type, initialCode, order }) => {
      try {
        const room = await LiveInterviewRoom.findOne({ roomId });
        if (room) {
          const qObj = {
            questionId: questionId || `q${Date.now()}`,
            question,
            type: type || "Technical",
            initialCode: initialCode || "",
            order: order || 1,
          };
          const exists = room.questions.some((q) => q.questionId === qObj.questionId);
          if (!exists) {
            room.questions.push(qObj);
            await room.save();
          }
        }
        io.to(roomId).emit("new_question", {
          questionId: questionId || `q${Date.now()}`,
          question,
          type: type || "Technical",
          initialCode: initialCode || "",
          order,
        });
      } catch (err) {
        console.error("Send question error:", err.message);
      }
    });

    // Candidate submits answer
    socket.on("submit_answer", async ({ roomId, questionId, questionText, answer, code }) => {
      try {
        const room = await LiveInterviewRoom.findOne({ roomId });
        if (room) {
          const idx = room.responses.findIndex((r) => r.questionId === questionId);
          if (idx !== -1) {
            room.responses[idx].answer = answer;
            if (code) room.responses[idx].code = code;
            room.responses[idx].answeredAt = new Date();
          } else {
            room.responses.push({
              questionId: questionId || "q1",
              questionText: questionText || "Question",
              answer,
              code,
              answeredAt: new Date(),
            });
          }
          await room.save();
        }

        io.to(roomId).emit("answer_submitted", {
          questionId,
          questionText,
          answer,
          code,
          candidateName: currentUserName,
        });
      } catch (err) {
        console.error("Submit answer error:", err.message);
      }
    });

    // Real-time Candidate Written Answer Typing Stream
    socket.on("answer_typing", ({ roomId, questionId, textAnswer, code }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      io.to(targetRoom).emit("answer_typing", {
        questionId: questionId || "q1",
        textAnswer: textAnswer || "",
        code: code || "",
        candidateName: currentUserName || "Candidate",
      });

      io.to(targetRoom).emit("answer_updated", {
        questionId: questionId || "q1",
        textAnswer: textAnswer || "",
        code: code || "",
      });

      socket.to(targetRoom).emit("typing_indicator", {
        isTyping: true,
        userName: currentUserName || "Candidate",
      });
    });

    // Real-time Candidate Code Editor Stream
    socket.on("code_changed", ({ roomId, questionId, code, language, textAnswer }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      io.to(targetRoom).emit("code_changed", {
        questionId: questionId || "q1",
        code: code || "",
        language: language || "javascript",
      });

      io.to(targetRoom).emit("code_updated", {
        questionId: questionId || "q1",
        code: code || "",
        language: language || "javascript",
      });

      io.to(targetRoom).emit("interview_code_change", {
        code: code || "",
        language: language || "javascript",
      });

      if (textAnswer !== undefined) {
        io.to(targetRoom).emit("answer_typing", {
          questionId: questionId || "q1",
          textAnswer: textAnswer || "",
          code: code || "",
          candidateName: currentUserName || "Candidate",
        });
      }
    });

    socket.on("interview_code_change", ({ roomId, code, language }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      io.to(targetRoom).emit("code_changed", { code: code || "", language: language || "javascript" });
      io.to(targetRoom).emit("code_updated", { code: code || "", language: language || "javascript" });
      io.to(targetRoom).emit("interview_code_change", { code: code || "", language: language || "javascript" });
    });

    socket.on("send_message", ({ roomId, message, text, sender }) => {
      const targetRoom = roomId || currentRoomId;
      if (!targetRoom) return;

      let textContent = "";
      let senderName = sender || currentUserName || currentUserRole;
      let role = currentUserRole;
      let timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (typeof message === "object" && message !== null) {
        textContent = message.text || message.message || "";
        senderName = message.sender || senderName;
        role = message.role || role;
        timestamp = message.timestamp || timestamp;
      } else if (typeof message === "string") {
        textContent = message;
      } else if (typeof text === "string") {
        textContent = text;
      }

      const msgObj = {
        sender: senderName,
        role: role,
        text: textContent,
        timestamp: timestamp,
      };

      io.to(targetRoom).emit("receive_message", msgObj);
    });

    // Admin pushes next question
    socket.on("next_question", async ({ roomId, questionIndex, questionId, question, type, initialCode }) => {
      try {
        await LiveInterviewRoom.updateOne({ roomId }, { currentQuestionIndex: questionIndex });
        io.to(roomId).emit("new_question", {
          questionIndex,
          questionId,
          question,
          type: type || "Technical",
          initialCode: initialCode || "",
        });
      } catch (err) {
        console.error("Next question error:", err.message);
      }
    });

    // Admin / Candidate ends interview -> triggers AI Evaluation & terminates session for all participants
    socket.on("end_interview", async ({ roomId, responses }) => {
      stopServerTimer(roomId);
      try {
        const room = await LiveInterviewRoom.findOne({ roomId });
        if (!room) return;

        if (responses && Array.isArray(responses) && responses.length > 0) {
          responses.forEach((resp) => {
            const existingIdx = room.responses.findIndex((r) => r.questionId === resp.questionId);
            if (existingIdx !== -1) {
              if (resp.answer) room.responses[existingIdx].answer = resp.answer;
              if (resp.code) room.responses[existingIdx].code = resp.code;
            } else {
              room.responses.push(resp);
            }
          });
        }

        const finalResult = await liveInterviewController.generateInterviewEvaluation(room);

        room.status = "completed";
        room.endedAt = new Date();
        room.finalResult = finalResult;
        await room.save();

        io.to(roomId).emit("interview_ended", { room, finalResult });
        io.to(roomId).emit("final_result", { finalResult });
      } catch (err) {
        console.error("End interview socket error:", err.message);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (currentRoomId && roomParticipants.has(currentRoomId)) {
        roomParticipants.get(currentRoomId).delete(socket.id);
        const participants = Array.from(roomParticipants.get(currentRoomId).values());
        const hasAdmin = participants.some((p) => p.role === "Admin" || p.role === "Interviewer");
        const hasCandidate = participants.some((p) => p.role === "Candidate");

        io.to(currentRoomId).emit("candidate_joined", {
          status: hasCandidate ? "Connected" : "Offline",
          hasAdmin,
          hasCandidate,
          participants,
        });

        if (roomParticipants.get(currentRoomId).size === 0) {
          roomParticipants.delete(currentRoomId);
        }
      }
    });
  });
};
