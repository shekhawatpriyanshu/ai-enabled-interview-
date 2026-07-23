const express = require("express");
const router = express.Router();

const {
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} = require("../controllers/adminBadgeController");

const adminProtect = require("../middlewares/adminProtect");

// Badge CRUD Routes
router.get("/", adminProtect, getBadges);
router.post("/", adminProtect, createBadge);
router.put("/:id", adminProtect, updateBadge);
router.delete("/:id", adminProtect, deleteBadge);

module.exports = router;
