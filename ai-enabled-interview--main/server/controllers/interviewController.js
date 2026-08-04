const InterviewSession = require("../models/interviewSession");
const InterviewFeedback = require("../models/interviewFeedback");

const {
  generateQuestions,
  evaluateInterview,
  generateAdaptiveCodingQuestions,
  generateVoiceQuestions,
  evaluateComprehensiveInterview
} = require("../services/aiInterviewService");
const { executeCode } = require("../services/judge0Services");


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
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
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


// SUBMIT INTERVIEW (Round 1: MCQ)
const submitInterview = async (req, res) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (!req.body.questions || !Array.isArray(req.body.questions)) {
      return res.status(400).json({ success: false, message: "Questions array required" });
    }

    interview.questions = req.body.questions;
    
    // Evaluate Round 1
    const aiFeedback = await evaluateInterview(interview.role, interview.questions);
    interview.mcqScore = aiFeedback.score;
    
    // Check gating threshold (50%)
    if (interview.mcqScore < 50) {
      interview.status = "Completed";
      interview.overallScore = interview.mcqScore;
      await interview.save();
      
      let feedback = await InterviewFeedback.findOne({ interview: interview._id });
      if (feedback) {
        feedback = await InterviewFeedback.findByIdAndUpdate(feedback._id, aiFeedback, { new: true });
      } else {
        feedback = await InterviewFeedback.create({
          interview: interview._id,
          user: req.user._id,
          ...aiFeedback
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Interview completed (did not pass Round 1)",
        interview,
        feedback,
      });
    }

    // Passed Round 1: Generate Coding Questions for Round 2
    interview.currentRound = 2;
    const codingQuestions = await generateAdaptiveCodingQuestions(interview.role, interview.experienceLevel);
    interview.codingQuestions = codingQuestions;
    
    await interview.save();
    
    return res.status(200).json({
      success: true,
      message: "Round 1 passed. Proceeding to Round 2.",
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT CODING ROUND (Round 2)
const submitCodingRound = async (req, res) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    // Expecting req.body.codingQuestions (array of code submissions and scores)
    if (!req.body.codingQuestions) return res.status(400).json({ success: false, message: "Coding results required" });

    interview.codingQuestions = req.body.codingQuestions;
    
    // Calculate coding score (average of the coding questions' scores)
    const totalScore = interview.codingQuestions.reduce((acc, q) => acc + (Number(q.score) || 0), 0);
    interview.codingScore = interview.codingQuestions.length > 0 ? Math.round(totalScore / interview.codingQuestions.length) : 0;
    
    const averageScore = Math.round((interview.mcqScore + interview.codingScore) / 2);

    // Gating logic: At least 1 question completely submitted (score === 100)
    const passedRound2 = interview.codingQuestions.some(q => Number(q.score) === 100);
    
    if (!passedRound2) {
      interview.status = "Completed";
      interview.overallScore = averageScore;
      await interview.save();
      
      // Generate Feedback for Round 1 & 2 failure
      const comprehensiveFeedback = await evaluateComprehensiveInterview(
        interview.role,
        interview.mcqScore,
        interview.codingScore,
        [] // No transcript yet
      );
      
      let feedback = await InterviewFeedback.findOne({ interview: interview._id });
      if (feedback) {
        feedback = await InterviewFeedback.findByIdAndUpdate(feedback._id, comprehensiveFeedback, { new: true });
      } else {
        feedback = await InterviewFeedback.create({
          interview: interview._id,
          user: req.user._id,
          ...comprehensiveFeedback
        });
      }

      return res.status(200).json({
        success: true,
        message: "Interview completed (did not pass Round 2)",
        interview,
        feedback,
      });
    }

    // Passed Round 2: Generate Voice Questions for Round 3
    interview.currentRound = 3;
    const resumeDetails = "Candidate Profile"; // In reality, fetch from User's resume
    const voiceData = await generateVoiceQuestions(
      interview.role, 
      resumeDetails, 
      "Missed some MCQ concepts", 
      "Average coding performance"
    );
    
    interview.voiceInterview = {
      transcript: [],
      technicalQuestions: voiceData.technicalQuestions || [],
      hrQuestions: voiceData.hrQuestions || []
    };
    
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Round 2 passed. Proceeding to Round 3.",
      interview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RUN INTERVIEW CODE (Round 2 execution)
const runInterviewCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let passed = 0;
    let finalStatus = "Accepted";
    let errorOutput = "";

    for (const testCase of testCases) {
      const result = await executeCode({
        code,
        language,
        input: testCase.input,
      });

      if (result.statusId === 6 || result.compileOutput) {
        finalStatus = "Compilation Error";
        errorOutput = result.compileOutput || result.stderr;
        break;
      }

      if (result.stderr || (result.statusId > 3 && result.statusId !== 6)) {
        finalStatus = result.status || "Runtime Error";
        errorOutput = result.stderr || result.stdout;
        break;
      }

      const actualOutput = result.stdout.trim();
      const expectedOutput = testCase.output.trim();

      if (actualOutput === expectedOutput) {
        passed++;
      } else {
        finalStatus = "Wrong Answer";
        errorOutput = `Expected ${expectedOutput} but got ${actualOutput}`;
        break;
      }
    }

    const score = Math.round((passed / testCases.length) * 100);

    return res.json({
      success: finalStatus === "Accepted",
      status: finalStatus,
      score,
      errorOutput
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT VOICE ROUND (Round 3)
const submitVoiceRound = async (req, res) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    if (req.body.transcript) {
      interview.voiceInterview.transcript = req.body.transcript;
    }

    interview.status = "Completed";
    await interview.save();

    // Final AI Evaluation across all 3 rounds
    const comprehensiveFeedback = await evaluateComprehensiveInterview(
      interview.role,
      interview.mcqScore,
      interview.codingScore,
      interview.voiceInterview.transcript
    );
    
    interview.overallScore = comprehensiveFeedback.score || Math.round((interview.mcqScore + interview.codingScore) / 2);
    await interview.save();

    let feedback = await InterviewFeedback.findOne({ interview: interview._id });
    if (feedback) {
      feedback = await InterviewFeedback.findByIdAndUpdate(feedback._id, comprehensiveFeedback, { new: true });
    } else {
      feedback = await InterviewFeedback.create({
        interview: interview._id,
        user: req.user._id,
        ...comprehensiveFeedback
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      interview,
      feedback,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
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
  submitCodingRound,
  runInterviewCode,
  submitVoiceRound,
  getFeedback,
  getMyInterviews,
};