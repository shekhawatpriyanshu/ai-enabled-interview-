const express = require("express");
const router = express.Router();
const liveInterviewController = require("../controllers/liveInterviewController");

router.post("/create", liveInterviewController.createRoom);
router.get("/users/all", liveInterviewController.getAllRegisteredUsers);
router.get("/", liveInterviewController.getRooms);
router.get("/:roomId", liveInterviewController.getRoomById);
router.post("/:roomId/run", liveInterviewController.runCodeInRoom);
router.post("/:roomId/submit", liveInterviewController.submitAndEndInterview);
router.post("/:roomId/cancel", liveInterviewController.cancelInterview);
router.post("/:roomId/submit-answer", liveInterviewController.submitAnswer);
router.post("/:roomId/end", liveInterviewController.endInterviewAndEvaluate);

router.delete("/:roomId", liveInterviewController.deleteRoom);

module.exports = router;
