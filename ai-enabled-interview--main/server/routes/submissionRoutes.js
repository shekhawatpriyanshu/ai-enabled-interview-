const express = require("express");
const router = express.Router();

const {
    getMySubmissions,
    getSubmissionDetails,
    getProblemSubmissions,
    getCodingStats
} = require("../controllers/submissionController");

const { protect } = require("../middlewares/authMiddleware");

//------------------------------------
// Logged user submissions
//------------------------------------
router.get(
    "/my",
    protect,
    getMySubmissions
);

//------------------------------------
// Problem submissions
//------------------------------------
router.get(
    "/problem/:problemId",
    protect,
    getProblemSubmissions
);

//------------------------------------
// Stats
//------------------------------------
router.get(
    "/stats",
    protect,
    getCodingStats
);

//------------------------------------
// Single submission
//------------------------------------
router.get(
    "/:id",
    protect,
    getSubmissionDetails
);

module.exports = router;
