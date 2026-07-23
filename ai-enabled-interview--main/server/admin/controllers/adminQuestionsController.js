const Question = require("../../models/question");
const Topic = require("../../models/topic");
const Company = require("../../models/company");


// ===============================
// CREATE TOPIC
// ===============================
const createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required",
      });
    }

    const existingTopic = await Topic.findOne({
      name: name.trim(),
    });

    if (existingTopic) {
      return res.status(400).json({
        success: false,
        message: "Topic already exists",
      });
    }

    const topic = await Topic.create({
      name: name.trim(),
      description,
    });

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET ALL TOPICS
// ===============================
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET TOPIC BY ID
// ===============================
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    res.status(200).json({
      success: true,
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// UPDATE TOPIC
// ===============================
const updateTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    if (name) {
      const exists = await Topic.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Topic already exists",
        });
      }

      topic.name = name.trim();
    }

    if (description !== undefined) {
      topic.description = description;
    }

    await topic.save();

    res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// DELETE TOPIC
// ===============================
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const questionExists = await Question.findOne({
      topic: topic._id,
    });

    if (questionExists) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete topic because it is assigned to one or more questions.",
      });
    }

    await Topic.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// =========================================
// CREATE COMPANY
// =========================================
const createCompany = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const existingCompany = await Company.findOne({
      name: name.trim(),
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      name: name.trim(),
      description,
      logo,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// GET ALL COMPANIES
// =========================================
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// GET COMPANY BY ID
// =========================================
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// UPDATE COMPANY
// =========================================
const updateCompany = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (name && name.trim() !== "") {
      const exists = await Company.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Company already exists",
        });
      }

      company.name = name.trim();
    }

    if (description !== undefined) {
      company.description = description;
    }

    if (logo !== undefined) {
      company.logo = logo;
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// DELETE COMPANY
// =========================================
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const questionExists = await Question.findOne({
      company: company._id,
    });

    if (questionExists) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete company because it is assigned to one or more questions.",
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// =========================================
// CREATE QUESTION
// =========================================
const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      answer,
      difficulty,
      topic,
      company,
      tags,
      examples,
      constraints,
      hints,
      question,
      options,
      correctAnswer,
    } = req.body;

    if (!title || !answer || !topic || !company) {
      return res.status(400).json({
        success: false,
        message: "Title, Answer, Topic and Company are required.",
      });
    }

    const existingQuestion = await Question.findOne({
      title: title.trim(),
    });

    if (existingQuestion) {
      return res.status(400).json({
        success: false,
        message: "Question title already exists.",
      });
    }

    const topicExists = await Topic.findById(topic);

    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const newQuestion = await Question.create({
      title: title.trim(),
      description,
      answer,
      difficulty,
      topic,
      company,
      tags,
      examples,
      constraints,
      hints,
      question,
      options,
      correctAnswer,
      createdBy: req.user._id,
    });

    const populatedQuestion = await Question.findById(
      newQuestion._id
    )
      .populate("topic")
      .populate("company")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Question created successfully.",
      question: populatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// GET ALL QUESTIONS
// =========================================
const getQuestions = async (req, res) => {
  try {
    const {
      search,
      topic,
      company,
      difficulty,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (topic) {
      filter.topic = topic;
    }

    if (company) {
      filter.company = company;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const total = await Question.countDocuments(filter);

    const questions = await Question.find(filter)
      .populate("topic")
      .populate("company")
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalQuestions: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================================
// GET QUESTION BY ID
// =========================================
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    )
      .populate("topic")
      .populate("company")
      .populate("createdBy", "name email");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// =========================================
// UPDATE QUESTION
// =========================================
const updateQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      answer,
      difficulty,
      topic,
      company,
      tags,
      examples,
      constraints,
      hints,
      question,
      options,
      correctAnswer,
    } = req.body;

    const existingQuestion = await Question.findById(req.params.id);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Duplicate title check
    if (title && title.trim() !== existingQuestion.title) {
      const duplicate = await Question.findOne({
        title: title.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Question title already exists.",
        });
      }

      existingQuestion.title = title.trim();
    }

    // Topic validation
    if (topic) {
      const topicExists = await Topic.findById(topic);

      if (!topicExists) {
        return res.status(404).json({
          success: false,
          message: "Topic not found",
        });
      }

      existingQuestion.topic = topic;
    }

    // Company validation
    if (company) {
      const companyExists = await Company.findById(company);

      if (!companyExists) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      existingQuestion.company = company;
    }

    if (description !== undefined)
      existingQuestion.description = description;

    if (answer !== undefined)
      existingQuestion.answer = answer;

    if (difficulty !== undefined)
      existingQuestion.difficulty = difficulty;

    if (tags !== undefined)
      existingQuestion.tags = tags;

    if (examples !== undefined)
      existingQuestion.examples = examples;

    if (constraints !== undefined)
      existingQuestion.constraints = constraints;

    if (hints !== undefined)
      existingQuestion.hints = hints;

    if (question !== undefined)
      existingQuestion.question = question;

    if (options !== undefined)
      existingQuestion.options = options;

    if (correctAnswer !== undefined)
      existingQuestion.correctAnswer = correctAnswer;

    await existingQuestion.save();

    const updatedQuestion = await Question.findById(
      existingQuestion._id
    )
      .populate("topic")
      .populate("company")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// DELETE QUESTION
// =========================================
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// EXPORTS
// =========================================
module.exports = {
  // Topic
  createTopic,
  getTopics,
  getTopicById,
  updateTopic,
  deleteTopic,

  // Company
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,

  // Question
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};