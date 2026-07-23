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
      const rawDiscussions =
        await Discussion.find()
          .populate(
            "user",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      const Comment = require("../models/comment");
      const discussions = await Promise.all(
        rawDiscussions.map(async (disc) => {
          const comments = await Comment.find({ discussion: disc._id });
          return {
            ...disc.toObject(),
            comments,
          };
        })
      );

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

      const populatedGroup = await StudyGroup.findById(group._id)
        .populate("owner", "name")
        .populate("members", "name email");

      res.status(201).json({
        success: true,
        group: populatedGroup,
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
          )
          .populate(
            "members",
            "name email"
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

      const populatedGroup = await StudyGroup.findById(group._id)
        .populate("owner", "name")
        .populate("members", "name email");

      res.status(200).json({
        success: true,
        group: populatedGroup,
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
      let fileUrl = "";
      let fileType = "";
      let fileName = "";

      if (req.file) {
        // Format relative url for frontend serving (Express static serves /uploads)
        fileUrl = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;

        const mime = req.file.mimetype || "";
        if (mime.startsWith("image/")) {
          fileType = "image";
        } else if (mime.startsWith("video/")) {
          fileType = "video";
        } else if (mime.startsWith("audio/")) {
          fileType = "audio";
        } else {
          fileType = "file";
        }
      }

      const message =
        await GroupMessage.create({
          group:
            req.params.id,
          sender:
            req.user._id,
          message:
            req.body.message || "",
          fileUrl,
          fileType,
          fileName,
        });

      // Populate sender details so frontend can display the user's name
      const populatedMessage = await GroupMessage.findById(message._id).populate(
        "sender",
        "name"
      );

      // Broadcast to socket room for this group
      const io = req.app.get("socketio");
      if (io) {
        io.to(req.params.id).emit("new_message", populatedMessage);
      }

      res.status(201).json({
        success: true,
        message: populatedMessage,
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

const editMessage = async (req, res) => {
  try {
    const { id } = req.params; // messageId
    const { message: newText } = req.body;

    const message = await GroupMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Verify sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    message.message = newText;
    await message.save();

    const populatedMessage = await GroupMessage.findById(message._id).populate(
      "sender",
      "name"
    );

    // Broadcast updated message to socket room
    const io = req.app.get("socketio");
    if (io) {
      io.to(message.group.toString()).emit("update_message", populatedMessage);
    }

    res.status(200).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // messageId

    const message = await GroupMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Verify sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    const groupId = message.group.toString();

    // Use deleteOne to remove it
    await GroupMessage.deleteOne({ _id: id });

    // Broadcast deleted message to socket room
    const io = req.app.get("socketio");
    if (io) {
      io.to(groupId).emit("delete_message", { messageId: id, groupId });
    }

    res.status(200).json({
      success: true,
      messageId: id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
  editMessage,
  deleteMessage,
};