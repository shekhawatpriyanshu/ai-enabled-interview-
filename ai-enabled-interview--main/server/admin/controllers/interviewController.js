const InterviewSession = require("../../models/interviewSession");
const InterviewFeedback = require("../../models/interviewFeedback");

/**
 * @desc Get All Interview Sessions
 * @route GET /api/admin/interviews
 * @access Admin
 */
exports.getAllInterviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const experience = req.query.experience || "";

if (experience) {
    query.experienceLevel = experience;
}

    const query = {};

    if (status) {
      query.status = status;
    }

    let interviews = await InterviewSession.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Search by user name/email/role
    if (search) {
      interviews = interviews.filter((item) => {
        return (
          item.role.toLowerCase().includes(search.toLowerCase()) ||
          item.user?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.user?.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
        );
      });
    }

    const total = interviews.length;

    interviews = interviews.slice(
      (page - 1) * limit,
      page * limit
    );

    res.status(200).json({
      success: true,
      interviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Interview Details
 * @route GET /api/admin/interviews/:id
 * @access Admin
 */
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await InterviewSession.findById(
      req.params.id
    ).populate("user", "name email");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const feedback = await InterviewFeedback.findOne({
      interview: interview._id,
    });

    res.status(200).json({
      success: true,
      interview,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Interview
 * @route DELETE /api/admin/interviews/:id
 * @access Admin
 */
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await InterviewSession.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.isDeleted = true;
    interview.deletedAt = new Date();
    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Interview Status
 * @route PUT /api/admin/interviews/:id/status
 * @access Admin
 */
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const interview = await InterviewSession.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.status = status;

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview updated successfully.",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Dashboard Statistics
 * @route GET /api/admin/interviews/stats
 * @access Admin
 */
exports.getInterviewStats = async (req, res) => {
  try {
    const total = await InterviewSession.countDocuments();

    const completed =
      await InterviewSession.countDocuments({
        status: "Completed",
      });

    const started =
      await InterviewSession.countDocuments({
        status: "Started",
      });

    const feedbacks =
      await InterviewFeedback.find();

    const averageScore =
      feedbacks.length > 0
        ? (
            feedbacks.reduce(
              (sum, item) => sum + item.score,
              0
            ) / feedbacks.length
          ).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        started,
        averageScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};