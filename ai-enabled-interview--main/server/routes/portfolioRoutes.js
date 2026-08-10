// portfolioRoutes.js
const express = require("express");
const router = express.Router();

const uploadResume = require("../middlewares/uploadResume");
const { protect } = require("../middlewares/authMiddleware");

const {
    generatePortfolio,
    getPortfolio,
    updatePortfolio,
    getPublicPortfolio,
    publishPortfolio,
} = require("../controllers/portfolioController");

router.post(
    "/generate",
    protect,
    uploadResume.single("resume"),
    generatePortfolio
);

router.get(
    "/me",
    protect,
    getPortfolio
);

router.put(
    "/update",
    protect,
    updatePortfolio
);

router.get(
    "/public/:slug",
    getPublicPortfolio
);

router.post(
    "/publish",
    protect,
    publishPortfolio
);

module.exports = router;