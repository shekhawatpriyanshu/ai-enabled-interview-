
const Portfolio = require("../models/Portfolio");

const {
    extractResumeText,
} = require("../services/resumeParserService");

const {
    generatePortfolioData,
} = require("../services/portfolioAIService");

const {
    getPortfolioStats,
} = require("../services/portfolioDataService");

const Resume = require("../models/resume");


const generatePortfolio = async (req, res) => {
    try {
        let fileSource = req.file;

        if (!fileSource && req.body?.resumeId) {
            const existingResume = await Resume.findById(req.body.resumeId);
            if (existingResume) {
                fileSource = existingResume.fileUrl;
            }
        }

        if (!fileSource) {
            return res.status(400).json({
                success: false,
                message: "Resume file or resumeId is required",
            });
        }

        const userId = req.user._id;

        // 1. Extract text
        const resumeText = await extractResumeText(fileSource);

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: "Could not extract sufficient text from resume",
            });
        }


        // 2. AI extraction
        const portfolioData =
            await generatePortfolioData(resumeText);

        // 3. Platform statistics
        const platformStats =
            await getPortfolioStats(userId);

        // 4. Create username/slug
        const name =
            portfolioData.personal?.name ||
            `user-${userId.toString().slice(-6)}`;

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // 5. Save/update portfolio
        const portfolio =
            await Portfolio.findOneAndUpdate(
                { user: userId },
                {
                    user: userId,

                    personal: portfolioData.personal,

                    summary: portfolioData.summary,

                    skills: portfolioData.skills,

                    experience: portfolioData.experience,

                    projects: portfolioData.projects,

                    education: portfolioData.education,

                    certifications:
                        portfolioData.certifications,

                    slug,

                    isPublished: true,
                },
                {
                    new: true,
                    upsert: true,
                }

            );

        return res.status(200).json({
            success: true,
            message: "Portfolio generated successfully",

            portfolio,

            stats: platformStats,
        });
    } catch (error) {
        console.error(
            "Portfolio generation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate portfolio",
        });
    }
};

const getPublicPortfolio = async (req, res) => {
  try {
    const rawSlug = req.params.slug;
    if (!rawSlug) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }

    const slugRegex = new RegExp(`^${rawSlug}$`, "i");

    // 1. Try finding by exact or case-insensitive slug
    let portfolio = await Portfolio.findOne({
      slug: slugRegex,
    }).lean();

    // 2. Fallback: Search by personal name or clean hyphenated name
    if (!portfolio) {
      const nameQuery = rawSlug.replace(/-/g, " ");
      portfolio = await Portfolio.findOne({
        "personal.name": new RegExp(`^${nameQuery}$`, "i"),
      }).lean();
    }

    // 3. Fallback: Return any published or latest user portfolio
    if (!portfolio) {
      portfolio = await Portfolio.findOne({
        $or: [
          { slug: { $regex: rawSlug, $options: "i" } },
          { "personal.name": { $regex: rawSlug.replace(/-/g, " "), $options: "i" } },
        ],
      }).lean();
    }

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error("Public Portfolio Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio",
    });
  }
};


const publishPortfolio = async (req, res) => {
  try {
    const { template } = req.body || {};
    const portfolio = await Portfolio.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        isPublished: true,
        ...(template ? { template } : {}),
      },
      {
        new: true,
      }
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio published",
      url: `/p/${portfolio.slug}`,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to publish portfolio",
    });
  }
};


const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.user._id });
        const stats = await getPortfolioStats(req.user._id);

        return res.status(200).json({
            success: true,
            portfolio,
            stats,
        });
    } catch (error) {
        console.error("Get portfolio error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio",
        });
    }
};

const updatePortfolio = async (req, res) => {
    try {
        const { personal, summary, skills, experience, projects, education, certifications, template, slug, isPublished } = req.body;

        const portfolio = await Portfolio.findOneAndUpdate(
            { user: req.user._id },
            {
                personal,
                summary,
                skills,
                experience,
                projects,
                education,
                certifications,
                template,
                ...(slug ? { slug } : {}),
                ...(typeof isPublished === "boolean" ? { isPublished } : {}),
            },
            { new: true, upsert: true }
        );

        const stats = await getPortfolioStats(req.user._id);

        return res.status(200).json({
            success: true,
            message: "Portfolio updated successfully",
            portfolio,
            stats,
        });
    } catch (error) {
        console.error("Update portfolio error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update portfolio",
        });
    }
};

module.exports = {
    generatePortfolio,
    getPortfolio,
    updatePortfolio,
    getPublicPortfolio,
    publishPortfolio,
};