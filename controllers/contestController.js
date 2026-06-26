const Contest = require("../models/contest");
const ContestSubmission =
  require("../models/contestSubmission");
const Leaderboard =
  require("../models/leaderboard");


// CREATE CONTEST
const createContest = async (
  req,
  res
) => {
  try {
    const contest =
      await Contest.create(req.body);

    res.status(201).json({
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


// GET ALL CONTESTS
const getContests = async (
  req,
  res
) => {
  try {
    const contests =
      await Contest.find().populate(
        "problems"
      );

    res.status(200).json({
      success: true,
      contests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE CONTEST
const getContest = async (
  req,
  res
) => {
  try {
    const contest =
      await Contest.findById(
        req.params.id
      ).populate("problems");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message:
          "Contest not found",
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


// JOIN CONTEST
const joinContest = async (
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
          "Contest not found",
      });
    }

    const existing =
      await ContestSubmission.findOne(
        {
          contest:
            contest._id,
          user:
            req.user._id,
        }
      );

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Already joined",
      });
    }

    const submission =
      await ContestSubmission.create(
        {
          contest:
            contest._id,
          user:
            req.user._id,
          totalProblems:
            contest.problems.length,
        }
      );

    res.status(201).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SUBMIT CONTEST
const submitContest = async (
  req,
  res
) => {
  try {
    const {
      score,
      solvedProblems,
    } = req.body;

    const submission =
      await ContestSubmission.findOne(
        {
          contest:
            req.params.id,
          user:
            req.user._id,
        }
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Contest participation not found",
      });
    }

    submission.score = score;
    submission.solvedProblems =
      solvedProblems;

    await submission.save();

    await Leaderboard.create({
      contest:
        submission.contest,
      user:
        req.user._id,
      score,
    });

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// LEADERBOARD
const getLeaderboard =
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

      leaderboard.forEach(
        (item, index) => {
          item.rank = index + 1;
        }
      );

      res.status(200).json({
        success: true,
        leaderboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// MY CONTESTS
const getMyContests =
  async (req, res) => {
    try {
      const contests =
        await ContestSubmission.find({
          user:
            req.user._id,
        })
          .populate(
            "contest"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        contests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  createContest,
  getContests,
  getContest,
  joinContest,
  submitContest,
  getLeaderboard,
  getMyContests,
};