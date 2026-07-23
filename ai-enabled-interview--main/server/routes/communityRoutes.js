const express = require("express");

const {
  createDiscussion,
  getDiscussions,
  likeDiscussion,
  addComment,
  getComments,
  createGroup,
  getGroups,
  joinGroup,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require(
  "../controllers/communityController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const upload = require("../middlewares/upload");

const router =
  express.Router();

router.post(
  "/discussion/create",
  protect,
  createDiscussion
);

router.get(
  "/discussion/all",
  getDiscussions
);

router.post(
  "/discussion/like/:id",
  protect,
  likeDiscussion
);

router.post(
  "/comment/:id",
  protect,
  addComment
);

router.get(
  "/comments/:id",
  getComments
);

router.post(
  "/group/create",
  protect,
  createGroup
);

router.get(
  "/group/all",
  getGroups
);

router.post(
  "/group/join/:id",
  protect,
  joinGroup
);

router.post(
  "/group/message/:id",
  protect,
  upload.single("file"),
  sendMessage
);

router.get(
  "/group/messages/:id",
  getMessages
);

router.put(
  "/group/message/:id",
  protect,
  editMessage
);

router.delete(
  "/group/message/:id",
  protect,
  deleteMessage
);

module.exports = router;