const Discussion = require("../../models/discussion");
const Comment = require("../../models/comment");
const StudyGroup = require("../../models/studyGroup");
const GroupMessage = require("../../models/groupMessage");
const User = require("../../models/user");


// ==============================================
// Dashboard
// GET /api/admin/community/dashboard
// ==============================================

const getDashboard = async (req, res) => {
  try {
    // Cleanup orphaned messages (sender or group deleted)
    const allMessages = await GroupMessage.find();
    for (const msg of allMessages) {
      const [userExists, groupExists] = await Promise.all([
        User.exists({ _id: msg.sender }),
        StudyGroup.exists({ _id: msg.group })
      ]);
      if (!userExists || !groupExists) {
        await GroupMessage.deleteOne({ _id: msg._id });
      }
    }

    const [
      totalDiscussions,
      totalComments,
      totalGroups,
      totalMessages,
      totalUsers,
    ] = await Promise.all([
      Discussion.countDocuments(),
      Comment.countDocuments(),
      StudyGroup.countDocuments(),
      GroupMessage.countDocuments(),
      User.countDocuments({ role: "user" }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDiscussions,
        totalComments,
        totalGroups,
        totalMessages,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==============================================
// Get Discussions
// GET /api/admin/community/discussions
// ==============================================

const getDiscussions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Discussion.countDocuments(query);

    const discussions = await Discussion.find(query)
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const data = await Promise.all(
      discussions.map(async (discussion) => {
        const totalComments =
          await Comment.countDocuments({
            discussion: discussion._id,
          });

        return {
          ...discussion,
          totalComments,
          totalLikes:
            discussion.likes.length,
        };
      })
    );

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      discussions: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==============================================
// Get Discussion Details
// GET /api/admin/community/discussion/:id
// ==============================================

const getDiscussionById =
  async (req, res) => {
    try {
      const discussion =
        await Discussion.findById(
          req.params.id
        )
          .populate(
            "user",
            "name email"
          )
          .lean();

      if (!discussion) {
        return res.status(404).json({
          success: false,
          message:
            "Discussion not found",
        });
      }

      const comments =
        await Comment.find({
          discussion:
            discussion._id,
        })
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        discussion: {
          ...discussion,
          totalLikes:
            discussion.likes.length,
          totalComments:
            comments.length,
          comments,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };




// ==============================================
// Delete Discussion
// DELETE /api/admin/community/discussion/:id
// ==============================================

const deleteDiscussion =
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

      // Delete all comments
      await Comment.deleteMany({
        discussion:
          discussion._id,
      });

      // Delete discussion
      await Discussion.findByIdAndDelete(
        discussion._id
      );

      res.status(200).json({
        success: true,
        message:
          "Discussion deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================================
// Get All Comments
// GET /api/admin/community/comments
// ==============================================

const getComments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.text = {
        $regex: search,
        $options: "i",
      };
    }

    const total = await Comment.countDocuments(query);

    const comments = await Comment.find(query)
      .populate("user", "name email")
      .populate("discussion", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==============================================
// Get Comments Of One Discussion
// GET /api/admin/community/comments/:discussionId
// ==============================================

const getDiscussionComments = async (req, res) => {
  try {
    const discussion =
      await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const comments = await Comment.find({
      discussion: req.params.id,
    })
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      total: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==============================================
// Delete Comment
// DELETE /api/admin/community/comment/:id
// ==============================================

const deleteComment = async (req, res) => {
  try {
    const comment =
      await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================================
// Get All Study Groups
// GET /api/admin/community/groups
// ==============================================

const getGroups = async (req, res) => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;


    const search =
      req.query.search || "";


    const query = {};


    if(search){
      query.name = {
        $regex: search,
        $options:"i"
      };
    }


    const total =
      await StudyGroup.countDocuments(query);


    const groups =
      await StudyGroup.find(query)
      .populate(
        "owner",
        "name email"
      )
      .populate(
        "members",
        "name email"
      )
      .sort({
        createdAt:-1
      })
      .skip(skip)
      .limit(limit)
      .lean();



    const formattedGroups =
      groups.map(group=>({

        _id:group._id,

        name:group.name,

        description:
          group.description,


        owner:
          group.owner,


        membersCount:
          group.members.length,


        createdAt:
          group.createdAt

      }));



    res.status(200).json({

      success:true,

      page,

      pages:
        Math.ceil(total/limit),

      total,

      groups:
        formattedGroups

    });



  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }
};





// ==============================================
// Get Single Group Details
// GET /api/admin/community/group/:id
// ==============================================

const getGroupById = async(req,res)=>{

try{


const group =
await StudyGroup.findById(
  req.params.id
)
.populate(
 "owner",
 "name email"
)
.populate(
 "members",
 "name email"
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}



const messages =
await GroupMessage.find({

group:group._id

})
.populate(
"sender",
"name email"
)
.sort({
createdAt:-1
})
.limit(20);



res.status(200).json({

success:true,

group,

recentMessages:messages

});



}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};





// ==============================================
// Update Group
// PUT /api/admin/community/group/:id
// ==============================================

const updateGroup =
async(req,res)=>{


try{


const {

name,

description


}=req.body;



const group =
await StudyGroup.findById(
req.params.id
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}




if(name)
group.name=name;


if(description)
group.description=description;



await group.save();



res.status(200).json({

success:true,

message:
"Group updated successfully",

group

});



}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};





// ==============================================
// Delete Group
// DELETE /api/admin/community/group/:id
// ==============================================

const deleteGroup =
async(req,res)=>{


try{


const group =
await StudyGroup.findById(
req.params.id
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}



// delete all group messages

await GroupMessage.deleteMany({

group:group._id

});



// delete group

await StudyGroup.findByIdAndDelete(

group._id

);



res.status(200).json({

success:true,

message:
"Group deleted successfully"

});



}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};
// ==============================================
// Get Group Members
// GET /api/admin/community/group/:id/members
// ==============================================

const getGroupMembers = async(req,res)=>{

try{


const group =
await StudyGroup.findById(
 req.params.id
)
.populate(
 "members",
 "name email profileImage"
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}



res.status(200).json({

success:true,

total:
group.members.length,

members:
group.members

});



}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};





// ==============================================
// Remove Member From Group
// DELETE /api/admin/community/group/:groupId/member/:userId
// ==============================================

const removeMember =
async(req,res)=>{


try{


const {

groupId,

userId

}=req.params;



const group =
await StudyGroup.findById(
groupId
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}



// remove user

group.members =
group.members.filter(

member =>

member.toString()
!== userId

);



await group.save();



res.status(200).json({

success:true,

message:
"Member removed successfully"

});



}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};






// ==============================================
// Get All Messages
// GET /api/admin/community/messages
// ==============================================

const getMessages =
async(req,res)=>{


try{


const page =
Number(req.query.page)||1;


const limit =
Number(req.query.limit)||20;


const skip =
(page-1)*limit;



const search =
req.query.search || "";



const query={};



if(search){

query.message={

$regex:search,

$options:"i"

};

}



const total =
await GroupMessage.countDocuments(
query
);



const messages =
await GroupMessage.find(query)

.populate(
"sender",
"name email"
)

.populate(
"group",
"name"
)

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);



res.status(200).json({

success:true,

page,

pages:
Math.ceil(total/limit),

total,

messages

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}

};








// ==============================================
// Get Group Messages
// GET /api/admin/community/group/:id/messages
// ==============================================

const getGroupMessages =
async(req,res)=>{


try{


const group =
await StudyGroup.findById(
req.params.id
);



if(!group){

return res.status(404).json({

success:false,

message:"Group not found"

});

}




const page =
Number(req.query.page)||1;


const limit =
Number(req.query.limit)||50;


const skip =
(page-1)*limit;



const total =
await GroupMessage.countDocuments({

group:req.params.id

});



const messages =
await GroupMessage.find({

group:req.params.id

})

.populate(
"sender",
"name email"
)

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);



res.status(200).json({

success:true,

page,

pages:
Math.ceil(total/limit),

total,

messages

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}

};







// ==============================================
// Delete Message
// DELETE /api/admin/community/message/:id
// ==============================================

const deleteMessage =
async(req,res)=>{


try{


const message =
await GroupMessage.findById(
req.params.id
);



if(!message){

return res.status(404).json({

success:false,

message:
"Message not found"

});

}



await GroupMessage.findByIdAndDelete(

req.params.id

);



res.status(200).json({

success:true,

message:
"Message deleted successfully"

});


}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

// ==============================================
// Get Analytics
// GET /api/admin/community/analytics
// ==============================================
const getAnalytics = async (req, res) => {
  try {
    // Cleanup orphaned messages (sender or group deleted)
    const allMessages = await GroupMessage.find();
    for (const msg of allMessages) {
      const [userExists, groupExists] = await Promise.all([
        User.exists({ _id: msg.sender }),
        StudyGroup.exists({ _id: msg.group })
      ]);
      if (!userExists || !groupExists) {
        await GroupMessage.deleteOne({ _id: msg._id });
      }
    }

    const [topGroups, topDiscussions, activeUsers] = await Promise.all([
      StudyGroup.find()
        .sort({ members: -1 })
        .limit(5)
        .populate("owner", "name email")
        .lean(),
      Discussion.find()
        .sort({ likes: -1 })
        .limit(5)
        .populate("user", "name email")
        .lean(),
      User.find()
        .limit(5)
        .select("name email")
        .lean(),
    ]);

    const formattedGroups = topGroups.map(group => ({
      ...group,
      membersCount: group.members?.length || 0,
    }));

    const formattedDiscussions = topDiscussions.map(disc => ({
      ...disc,
      totalLikes: disc.likes?.length || 0,
    }));

    const messageStats = await GroupMessage.aggregate([
      { $group: { _id: "$sender", messageCount: { $sum: 1 } } },
      { $sort: { messageCount: -1 } },
      { $limit: 5 }
    ]);

    const populatedActiveUsers = await Promise.all(
      messageStats.map(async (stat) => {
        const user = await User.findById(stat._id).select("name email").lean();
        return {
          ...user,
          messageCount: stat.messageCount,
        };
      })
    );

    const finalActiveUsers = populatedActiveUsers.length > 0
      ? populatedActiveUsers.filter(u => u !== null)
      : (await User.find().limit(5).select("name email").lean()).map(u => ({ ...u, messageCount: 0 }));

    res.status(200).json({
      success: true,
      analytics: {
        totalDiscussions: await Discussion.countDocuments(),
        totalComments: await Comment.countDocuments(),
        totalGroups: await StudyGroup.countDocuments(),
        totalMessages: await GroupMessage.countDocuments(),
        totalUsers: await User.countDocuments({ role: "user" }),
        topGroups: formattedGroups,
        topDiscussions: formattedDiscussions,
        activeUsers: finalActiveUsers,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {


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

deleteMessage


};