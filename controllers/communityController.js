const Discussion =
  require("../models/discussion");

const Comment =
  require("../models/comment");

const StudyGroup =
  require("../models/studyGroup");

const GroupMessage =
  require("../models/groupMessage");


// --------------------
// DISCUSSIONS
// --------------------

const createDiscussion =
  async (req, res) => {
    try {
      const discussion =
        await Discussion.create({
          user:
            req.user._id,
          title:
            req.body.title,
          content:
            req.body.content,
          tags:
            req.body.tags,
        });

      res.status(201).json({
        success: true,
        discussion,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getDiscussions =
  async (req, res) => {
    try {
      const discussions =
        await Discussion.find()
          .populate(
            "user",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        discussions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const likeDiscussion =
  async (req, res) => {
    try {
      const discussion =
        await Discussion.findById(
          req.params.id
        );

      if (!discussion) {
        return res.status(404).json({
          success: false,
          message:
            "Discussion not found",
        });
      }

      const alreadyLiked =
        discussion.likes.includes(
          req.user._id
        );

      if (alreadyLiked) {
        discussion.likes =
          discussion.likes.filter(
            (id) =>
              id.toString() !==
              req.user._id.toString()
          );
      } else {
        discussion.likes.push(
          req.user._id
        );
      }

      await discussion.save();

      res.status(200).json({
        success: true,
        likes:
          discussion.likes.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// --------------------
// COMMENTS
// --------------------

const addComment =
  async (req, res) => {
    try {
      const comment =
        await Comment.create({
          discussion:
            req.params.id,
          user:
            req.user._id,
          text:
            req.body.text,
        });

      res.status(201).json({
        success: true,
        comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getComments =
  async (req, res) => {
    try {
      const comments =
        await Comment.find({
          discussion:
            req.params.id,
        })
          .populate(
            "user",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        comments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// --------------------
// STUDY GROUPS
// --------------------

const createGroup =
  async (req, res) => {
    try {
      const group =
        await StudyGroup.create({
          name:
            req.body.name,
          description:
            req.body.description,
          owner:
            req.user._id,
          members: [
            req.user._id,
          ],
        });

      res.status(201).json({
        success: true,
        group,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getGroups =
  async (req, res) => {
    try {
      const groups =
        await StudyGroup.find()
          .populate(
            "owner",
            "name"
          );

      res.status(200).json({
        success: true,
        groups,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const joinGroup =
  async (req, res) => {
    try {
      const group =
        await StudyGroup.findById(
          req.params.id
        );

      if (!group) {
        return res.status(404).json({
          success: false,
          message:
            "Group not found",
        });
      }

      if (
        !group.members.includes(
          req.user._id
        )
      ) {
        group.members.push(
          req.user._id
        );

        await group.save();
      }

      res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// --------------------
// GROUP CHAT
// --------------------

const sendMessage =
  async (req, res) => {
    try {
      const message =
        await GroupMessage.create({
          group:
            req.params.id,
          sender:
            req.user._id,
          message:
            req.body.message,
        });

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const getMessages =
  async (req, res) => {
    try {
      const messages =
        await GroupMessage.find({
          group:
            req.params.id,
        })
          .populate(
            "sender",
            "name"
          )
          .sort({
            createdAt: 1,
          });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
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
};