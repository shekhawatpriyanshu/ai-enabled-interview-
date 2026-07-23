const express = require("express");

const {
  createContest,
  getContests,
  getContestById,
  updateContest,
  
  deleteContest,
  getContestParticipants,
  getContestLeaderboard,
} = require("../controllers/contestController");

const adminProtect = require("../middlewares/adminProtect");

const router = express.Router();

// Protect all admin routes
router.use(adminProtect);

// ==========================================
// Contest CRUD
// ==========================================

// Create Contest
router.post(
  "/",
  createContest
);

// Get All Contests
router.get(
  "/",
  getContests
);
//get participant 

// Get Contest By ID
router.get(
  "/:id",
  getContestById
);

// Update Contest
router.put(
  "/:id",
  updateContest
);

// Delete Contest
router.delete(
  "/:id",
  deleteContest
);


// ==========================================
// Contest Participants
// ==========================================

router.get(
  "/:id/participants",
  getContestParticipants
);


// ==========================================
// Contest Leaderboard
// ==========================================

router.get(
  "/:id/leaderboard",
  getContestLeaderboard
);

module.exports = router;