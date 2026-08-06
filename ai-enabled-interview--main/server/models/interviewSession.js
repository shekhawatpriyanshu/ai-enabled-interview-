const mongoose = require("mongoose");

const interviewSessionSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      role: {
        type: String,
        required: true,
      },

      experienceLevel: {
        type: String,
        enum: [
          "Fresher",
          "Junior",
          "Mid",
          "Senior",
        ],
        default: "Fresher",
      },

      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
          answer: String,
        },
      ],

      currentRound: {
        type: Number,
        default: 1,
      },
      
      mcqScore: {
        type: Number,
        default: 0,
      },

      codingQuestions: [
        {
          problemTitle: String,
          problemDescription: String,
          starterCode: String,
          testCases: [
            {
              input: String,
              output: String,
            }
          ],
          codeSubmitted: String,
          languageSubmitted: String,
          status: String,
          score: { type: Number, default: 0 },
        }
      ],

      codingScore: {
        type: Number,
        default: 0,
      },

      voiceInterview: {
        transcript: [
          {
            speaker: String, // 'AI' or 'User'
            text: String,
          }
        ],
        technicalQuestions: [String],
        hrQuestions: [String],
      },

      overallScore: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "Started",
          "Completed",
        ],
        default: "Started",
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },

      deletedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

interviewSessionSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

interviewSessionSchema.pre("countDocuments", function () {
  this.where({ isDeleted: { $ne: true } });
});

interviewSessionSchema.post('save', function(doc) {
  if (global.socketIo) {
    const isNew = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    if (isNew) {
      global.socketIo.emit("new_activity", {
        type: "Interview",
        text: `Interview session started`,
        createdAt: doc.createdAt || new Date(),
        icon: "🎤"
      });
    }
  }
});

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);