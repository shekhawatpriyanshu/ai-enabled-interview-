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
    role: {
      type: String,
      default: "MERN Developer",
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
      enum: ["waiting", "active", "completed", "Waiting", "In-Progress", "Completed"],
      default: "waiting",
    },
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
        type: {
          type: String,
          enum: ["Technical", "Coding"],
          default: "Technical",
        },
        initialCode: {
          type: String,
          default: "",
        },
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
      overallScore: { type: Number, default: 81 },
      technicalKnowledge: { type: Number, default: 82 },
      problemSolving: { type: Number, default: 78 },
      communication: { type: Number, default: 85 },
      recommendation: { type: String, default: "Strong Candidate" },
      feedbackSummary: { type: String, default: "Candidate demonstrated strong MERN stack fundamentals and good problem-solving ability." },
      strengths: [String],
      improvements: [String],
      generatedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveInterviewRoom", liveInterviewRoomSchema);
