const LiveInterviewRoom = require("../models/liveInterviewRoom");
const liveInterviewController = require("../controllers/liveInterviewController");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

const activeTimers = new Map();
const roomParticipants = new Map();

const startServerTimer = (io, roomId) => {
  if (activeTimers.has(roomId)) return;

  const interval = setInterval(async () => {
    try {
      const room = await LiveInterviewRoom.findOne({ roomId });
      if (!room || room.status !== "active" && room.status !== "In-Progress") {
        clearInterval(activeTimers.get(roomId));
        activeTimers.delete(roomId);
        return;
      }

      if (room.timerRemaining > 0) {
        room.timerRemaining -= 1;
        await room.save();
        io.to(roomId).emit("timer_tick", {
          timerRemaining: room.timerRemaining,
          status: room.status,
        });
      } else {
        room.status = "completed";
        room.endedAt = new Date();
        await room.save();

        io.to(roomId).emit("interview_ended", { reason: "Timer expired", room });
        clearInterval(activeTimers.get(roomId));
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
    socket.on("join_room", async ({ roomId, role, userName, userEmail }) => {
      currentRoomId = roomId;
      currentUserRole = role || "Candidate";
      currentUserName = userName || (currentUserRole === "Admin" || currentUserRole === "Interviewer" ? "Admin" : "Priyanshu");

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

      let room = await LiveInterviewRoom.findOne({ roomId });
      if (!room) {
        try {
          room = await LiveInterviewRoom.findOneAndUpdate(
            { roomId },
            {
              $setOnInsert: {
                roomId,
                candidateName: currentUserRole === "Candidate" ? currentUserName : "Priyanshu",
                interviewerName: currentUserRole === "Admin" || currentUserRole === "Interviewer" ? currentUserName : "Admin",
                status: "waiting",
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (e) {
          room = await LiveInterviewRoom.findOne({ roomId });
        }
      }

      if (room.status === "active" || room.status === "In-Progress") {
        startServerTimer(io, roomId);
      }

      // Broadcast candidate_joined event to room
      io.to(roomId).emit("candidate_joined", {
        candidateName: room.candidateName,
        status: hasCandidate ? "Connected" : "Offline",
        hasAdmin,
        hasCandidate,
        participants,
      });

      socket.emit("room_state", room);
      console.log(`Socket ${socket.id} (${currentUserName} - ${currentUserRole}) joined room: ${roomId}`);
    });

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

    // Admin / Candidate ends interview -> triggers AI Evaluation
    socket.on("end_interview", async ({ roomId }) => {
      stopServerTimer(roomId);
      try {
        const room = await LiveInterviewRoom.findOne({ roomId });
        if (!room) return;

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
