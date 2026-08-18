const mongoose = require("mongoose");

const liveInterviewRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    interviewerId: {
      type: String,
      default: "admin123",
    },
    candidateId: {
      type: String,
      default: "user456",
    },
    candidateEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      default: "priyanshu@gmail.com",
    },
    candidateName: {
      type: String,
      default: "Priyanshu",
    },
    interviewerName: {
      type: String,
      default: "Admin",
    },
    hostEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    creatorEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      default: "MERN Developer",
    },
    interviewType: {
      type: String,
      default: "Technical",
    },
    scheduledDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    scheduledTime: {
      type: String,
      default: "03:00 PM",
    },
    duration: {
      type: Number, // in minutes
      default: 30,
    },
    timerRemaining: {
      type: Number, // in seconds
      default: 1800,
    },
    status: {
      type: String,
      enum: ["scheduled", "waiting", "active", "completed", "cancelled", "Scheduled", "Waiting", "In-Progress", "Completed", "Cancelled"],
      default: "scheduled",
    },
    cancelReason: String,
    startedAt: Date,
    endedAt: Date,
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        questionId: String,
        question: String,
        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Medium",
        },
        problemDescription: String,
        type: {
          type: String,
          enum: ["Technical", "Coding"],
          default: "Coding",
        },
        initialCode: {
          type: String,
          default: "",
        },
        starterTemplates: {
          javascript: String,
          python: String,
          cpp: String,
          java: String,
        },
        examples: [
          {
            input: String,
            output: String,
            explanation: String,
          },
        ],
        constraints: [String],
        testCases: [
          {
            input: String,
            expectedOutput: String,
          },
        ],
        order: Number,
      },
    ],
    responses: [
      {
        questionId: String,
        questionText: String,
        answer: String,
        code: String,
        score: Number,
        feedback: String,
        answeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    finalResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveInterviewRoom", liveInterviewRoomSchema);
