const express = require("express");

const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
  submitTest,
  getMySubmissions,
} = require("../controllers/testController");

const {
  protect,
} = require("../middlewares/authMiddleware");

const router = express.Router();


// SUBMISSIONS
router.post(
  "/submit",
  protect,
  submitTest
);

router.get(
  "/my-submissions",
  protect,
  getMySubmissions
);

// TEST CRUD
router.post(
  "/create",
  protect,
  createTest
);

router.get(
  "/",
  getTests
);

router.get(
  "/:id",
  getTestById
);

router.put(
  "/update/:id",
  protect,
  updateTest
);

router.delete(
  "/delete/:id",
  protect,
  deleteTest
);

module.exports = router;