const express = require("express");
const router = express.Router();
const liveInterviewController = require("../controllers/liveInterviewController");

router.post("/create", liveInterviewController.createRoom);
router.get("/", liveInterviewController.getRooms);
router.get("/:roomId", liveInterviewController.getRoomById);
router.post("/:roomId/submit-answer", liveInterviewController.submitAnswer);
router.post("/:roomId/end", liveInterviewController.endInterviewAndEvaluate);

module.exports = router;
