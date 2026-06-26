const express = require("express");

const {
  uploadResume,
  getResumes,
  getResumeById,
  analyzeResume,
  getAnalysis,
  deleteResume,
} = require(
  "../controllers/resumeController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);
const upload =
  require(
    "../middlewares/uploadResume"
  );



const router = express.Router();



router.get(
  "/",
  protect,
  getResumes
);

router.get(
  "/:id",
  protect,
  getResumeById
);
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/analyze/:id",
  protect,
  analyzeResume
);

router.get(
  "/analysis/:id",
  protect,
  getAnalysis
);

router.delete(
  "/delete/:id",
  protect,
  deleteResume
);

module.exports = router;