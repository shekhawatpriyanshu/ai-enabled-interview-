const InterviewSession = require("../models/interviewSession");
const InterviewFeedback = require("../models/interviewFeedback");

const {
  generateQuestions,
  evaluateInterview,
} = require("../services/aiInterviewService");


// START INTERVIEW
const startInterview = async (req, res) => {
  try {
   const role =
  req.body.role?.trim();

const experienceLevel =
  req.body.experienceLevel ||
  "Fresher";
  if (!role) {
  return res.status(400).json({
    success: false,
    message:
      "Role is required",
  });
}

    const generatedQuestions =
      await generateQuestions(
        role,
        experienceLevel
      );

    const interview =
      await InterviewSession.create({
        user: req.user._id,

        role,

        experienceLevel:
          experienceLevel || "Fresher",

       questions:
  generatedQuestions.map(
    (q) => ({
      question: q,
      answer: "",
    })
  ),
      });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE INTERVIEW
const getInterview = async (req, res) => {
  try {
    const interview =
      await InterviewSession.findById(
        req.params.id
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SUBMIT INTERVIEW
const submitInterview = async (
  req,
  res
) => {
  try {
    const interview =
      await InterviewSession.findById(
        req.params.id
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    if (
      !req.body.questions ||
      !Array.isArray(
        req.body.questions
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Questions array required",
      });
    }

    interview.questions =
      req.body.questions;

    interview.status =
      "Completed";

    await interview.save();

    const aiFeedback =
      await evaluateInterview(
        interview.role,
        interview.questions
      );

    let feedback =
      await InterviewFeedback.findOne(
        {
          interview:
            interview._id,
        }
      );

    if (feedback) {
      feedback =
        await InterviewFeedback.findByIdAndUpdate(
          feedback._id,
          {
            score:
              aiFeedback.score,

            communication:
              aiFeedback.communication,

            technicalKnowledge:
              aiFeedback.technicalKnowledge,

            problemSolving:
              aiFeedback.problemSolving,

            strengths:
              aiFeedback.strengths,

            weaknesses:
              aiFeedback.weaknesses,

            suggestions:
              aiFeedback.suggestions,
          },
          {
            new: true,
          }
        );
    } else {
      feedback =
        await InterviewFeedback.create({
          interview:
            interview._id,

          user:
            req.user._id,

          score:
            aiFeedback.score,

          communication:
            aiFeedback.communication,

          technicalKnowledge:
            aiFeedback.technicalKnowledge,

          problemSolving:
            aiFeedback.problemSolving,

          strengths:
            aiFeedback.strengths,

          weaknesses:
            aiFeedback.weaknesses,

          suggestions:
            aiFeedback.suggestions,
        });
    }

    res.status(200).json({
      success: true,
      message:
        "Interview submitted successfully",
      interview,
      feedback,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET FEEDBACK
const getFeedback = async (
  req,
  res
) => {
  try {
    const feedback =
      await InterviewFeedback.findOne({
        interview:
          req.params.id,
      });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message:
          "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET MY INTERVIEWS
const getMyInterviews = async (
  req,
  res
) => {
  try {
    const page =
      Number(
        req.query.page
      ) || 1;

    const limit =
      Number(
        req.query.limit
      ) || 10;

    const skip =
      (page - 1) * limit;

    const totalInterviews =
      await InterviewSession.countDocuments(
        {
          user:
            req.user._id,
        }
      );

    const interviews =
      await InterviewSession.find(
        {
          user:
            req.user._id,
        }
      )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,

      interviews,

      currentPage: page,

      totalPages:
        Math.ceil(
          totalInterviews /
            limit
        ),

      totalInterviews,

      hasNextPage:
        page <
        Math.ceil(
          totalInterviews /
            limit
        ),

      hasPrevPage:
        page > 1,
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
  startInterview,
  getInterview,
  submitInterview,
  getFeedback,
  getMyInterviews,
};