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
} = require(
  "../controllers/communityController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

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
  sendMessage
);

router.get(
  "/group/messages/:id",
  getMessages
);

module.exports = router;