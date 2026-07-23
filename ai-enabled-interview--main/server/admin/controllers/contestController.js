const Contest = require("../../models/contest");
const CodingProblem = require("../../models/codingProblem");
const ContestSubmission = require("../../models/contestSubmission");
const Leaderboard = require("../../models/leaderboard");


// ==========================================
// CREATE CONTEST
// ==========================================
const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      problems,
      startTime,
      endTime,
      duration,
      status,
      isPublished,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Contest schedule is required.",
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration is required.",
      });
    }

    if (!problems || problems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one coding problem.",
      });
    }

    const problemCount = await CodingProblem.countDocuments({
      _id: { $in: problems },
    });

    if (problemCount !== problems.length) {
      return res.status(400).json({
        success: false,
        message: "Some selected coding problems do not exist.",
      });
    }

    const contest = await Contest.create({
      title,
      description,
      problems,
      startTime,
      endTime,
      duration,
      status: status || "Draft",
      isPublished: isPublished || false,
      createdBy: req.user._id,
    });

    const populatedContest = await Contest.findById(
      contest._id
    )
      .populate("createdBy", "name email")
      .populate(
        "problems",
        "title difficulty topic"
      );

    res.status(201).json({
      success: true,
      message: "Contest created successfully.",
      contest: populatedContest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CONTESTS
// ==========================================
const getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate("createdBy", "name email")
      .populate(
        "problems",
        "title difficulty topic"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contests.length,
      contests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE CONTEST
// ==========================================
const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(
      req.params.id
    )
      .populate("createdBy", "name email")
      .populate("problems");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      contest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// UPDATE CONTEST
// ==========================================
const updateContest = async (req, res) => {
  try {
    const {
      title,
      description,
      problems,
      startTime,
      endTime,
      duration,
      status,
      isPublished,
    } = req.body;

    const contest = await Contest.findById(
      req.params.id
    );

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    if (
      problems &&
      problems.length > 0
    ) {
      const count =
        await CodingProblem.countDocuments({
          _id: {
            $in: problems,
          },
        });

      if (count !== problems.length) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid coding problems selected.",
        });
      }
    }

    contest.title =
      title ?? contest.title;

    contest.description =
      description ??
      contest.description;

    contest.problems =
      problems ?? contest.problems;

    contest.startTime =
      startTime ??
      contest.startTime;

    contest.endTime =
      endTime ?? contest.endTime;

    contest.duration =
      duration ??
      contest.duration;

    if (status) {
      contest.status = status;
    }

    if (
      typeof isPublished ===
      "boolean"
    ) {
      contest.isPublished =
        isPublished;
    }

    await contest.save();

    const updatedContest =
      await Contest.findById(
        contest._id
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "problems"
        );

    res.status(200).json({
      success: true,
      message:
        "Contest updated successfully.",
      contest: updatedContest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// ==========================================
// DELETE CONTEST
// ==========================================
const deleteContest = async (
  req,
  res
) => {
  try {
    const contest =
      await Contest.findById(
        req.params.id
      );

    if (!contest) {
      return res.status(404).json({
        success: false,
        message:
          "Contest not found.",
      });
    }

    contest.isDeleted = true;
    contest.deletedAt = new Date();
    await contest.save();

    res.status(200).json({
      success: true,
      message:
        "Contest deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// ==========================================
// CONTEST PARTICIPANTS
// ==========================================
const getContestParticipants =
  async (req, res) => {
    try {
      const participants =
        await ContestSubmission.find({
          contest:
            req.params.id,
        })
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt:
              -1,
          });

      res.status(200).json({
        success: true,
        count:
          participants.length,
        participants,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ==========================================
// CONTEST LEADERBOARD
// ==========================================
const getContestLeaderboard =
  async (req, res) => {
    try {
      const leaderboard =
        await Leaderboard.find({
          contest:
            req.params.id,
        })
          .populate(
            "user",
            "name email"
          )
          .sort({
            score: -1,
          });

      const rankedLeaderboard =
        leaderboard.map(
          (
            item,
            index
          ) => ({
            ...item.toObject(),
            rank:
              index + 1,
          })
        );

      res.status(200).json({
        success: true,
        count:
          rankedLeaderboard.length,
        leaderboard:
          rankedLeaderboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  createContest,
  getContests,
  getContestById,
  updateContest,
  
  deleteContest,
  getContestParticipants,
  getContestLeaderboard,
};