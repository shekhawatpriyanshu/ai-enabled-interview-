const express = require("express");

const {
 
  getTests,
  getTestById,
 
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



router.get(
  "/",
  getTests
);

router.get(
  "/:id",
  getTestById
);

;



module.exports = router;