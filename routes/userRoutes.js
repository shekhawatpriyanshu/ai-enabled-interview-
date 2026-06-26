const express = require("express");

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/userController");

const {
  protect,
} = require("../middlewares/authMiddleware");
const upload =
  require("../middlewares/upload");


const router = express.Router();
router.post(
  "/profile",
  protect,
  upload.single("avatar"),
  createProfile
);


router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  updateProfile
);
router.delete("/profile", protect, deleteProfile);

module.exports = router;