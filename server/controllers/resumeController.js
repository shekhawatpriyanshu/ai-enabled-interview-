const Resume = require("../models/resume");
const ResumeAnalysis = require("../models/resumeAnalysis");

const path = require("path");
const fs = require("fs");

const {
  extractResumeText,
} = require("../services/resumeParser");

const {
  analyzeResumeWithAI,
} = require("../services/resumeAIService");


// Upload Resume
const uploadResume = async (
  req,
  res
) => {
  try {
    console.log(
      "Uploaded File:",
      req.file
    );

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Resume file required",
      });
    }

    const resume =
      await Resume.create({
        user: req.user._id,

        title:
          req.file.originalname,

        fileUrl:
          `/uploads/resumes/${req.file.filename}`,

        fileType: path
          .extname(
            req.file.originalname
          )
          .replace(".", ""),

        fileSize:
          req.file.size,
      });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get My Resumes
const getResumes = async (
  req,
  res
) => {
  try {
    const resumes =
      await Resume.find({
        user: req.user._id,
      });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Resume By Id
const getResumeById =
  async (req, res) => {
    try {
      const resume =
        await Resume.findById(
          req.params.id
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found",
        });
      }

      res.status(200).json({
        success: true,
        resume,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// Analyze Resume
const analyzeResume =
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message:
            "Target role is required",
        });
      }

      const resume =
        await Resume.findById(
          req.params.id
        );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found",
        });
      }

      console.log(
        "Resume DB Record:",
        resume
      );

      // FIXED FILE PATH
      const filePath =
        path.resolve(
          __dirname,
          "..",
          "uploads",
          "resumes",
          path.basename(
            resume.fileUrl
          )
        );

      console.log(
        "Generated Path:",
        filePath
      );

      const exists =
        fs.existsSync(
          filePath
        );

      console.log(
        "File Exists:",
        exists
      );

      if (!exists) {
        return res.status(404).json({
          success: false,
          message:
            "Resume file not found on server",
        });
      }

      const resumeText =
        await extractResumeText(
          filePath
        );

      console.log(
        "Resume Text Length:",
        resumeText.length
      );

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract resume text",
        });
      }

      const aiResult =
        await analyzeResumeWithAI(
          resumeText,
          role
        );

      await ResumeAnalysis.deleteMany(
        {
          resume:
            resume._id,
        }
      );

      const analysis =
        await ResumeAnalysis.create({
          resume:
            resume._id,

          user:
            req.user._id,

          ...aiResult,
        });

      res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
  console.error(
    
    error
  );

  res.status(500).json({
    success: false,
    message: error.message,
  });

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// Get Analysis
const getAnalysis =
  async (req, res) => {
    try {
      const analysis =
        await ResumeAnalysis.findOne({
          resume:
            req.params.id,
        });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "Analysis not found",
        });
      }

      res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// Delete Resume
const deleteResume =
  async (req, res) => {
    try {
      await Resume.findByIdAndDelete(
        req.params.id
      );

      await ResumeAnalysis.deleteMany(
        {
          resume:
            req.params.id,
        }
      );

      res.status(200).json({
        success: true,
        message:
          "Resume deleted successfully",
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
  uploadResume,
  getResumes,
  getResumeById,
  analyzeResume,
  getAnalysis,
  deleteResume,
};