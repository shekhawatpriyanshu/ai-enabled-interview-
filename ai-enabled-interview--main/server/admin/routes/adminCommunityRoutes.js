const express = require("express");

const router = express.Router();


const {

    // Dashboard
    getDashboard,
    getAnalytics,


    // Discussions
    getDiscussions,
    getDiscussionById,
    deleteDiscussion,


    // Comments
    getComments,
    getDiscussionComments,
    deleteComment,


    // Groups
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,


    // Members
    getGroupMembers,
    removeMember,


    // Messages
    getMessages,
    getGroupMessages,
    deleteMessage,


} = require(
    "../../admin/controllers/adminCommunityController"
);



const protectAdmin = require("../middlewares/adminProtect");



// =====================================
// Dashboard
// =====================================

router.get(
    "/dashboard",
    protectAdmin,
    getDashboard
);

router.get(
    "/analytics",
    protectAdmin,
    getAnalytics
);



// =====================================
// Discussion Management
// =====================================

router.get(
    "/discussions",
    protectAdmin,
    getDiscussions
);


router.get(
    "/discussion/:id",
    protectAdmin,
    getDiscussionById
);


router.delete(
    "/discussion/:id",
    protectAdmin,
    deleteDiscussion
);



// =====================================
// Comment Management
// =====================================

router.get(
    "/comments",
    protectAdmin,
    getComments
);


router.get(
    "/comments/:id",
    protectAdmin,
    getDiscussionComments
);


router.delete(
    "/comment/:id",
    protectAdmin,
    deleteComment
);



// =====================================
// Study Group Management
// =====================================

router.get(
    "/groups",
    protectAdmin,
    getGroups
);


router.get(
    "/group/:id",
    protectAdmin,
    getGroupById
);


router.put(
    "/group/:id",
    protectAdmin,
    updateGroup
);


router.delete(
    "/group/:id",
    protectAdmin,
    deleteGroup
);



// =====================================
// Group Members Management
// =====================================

router.get(
    "/group/:id/members",
    protectAdmin,
    getGroupMembers
);


router.delete(
    "/group/:groupId/member/:userId",
    protectAdmin,
    removeMember
);



// =====================================
// Group Message Management
// =====================================

router.get(
    "/messages",
    protectAdmin,
    getMessages
);


router.get(
    "/group/:id/messages",
    protectAdmin,
    getGroupMessages
);


router.delete(
    "/message/:id",
    protectAdmin,
    deleteMessage
);



module.exports = router;