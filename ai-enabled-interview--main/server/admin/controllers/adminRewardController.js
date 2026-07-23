const UserReward = require("../../models/userReward");
const Achievement = require("../../models/achievement");
const Badge = require("../../models/Badge");
const User = require("../../models/user");
const { createReward } = require("../../services/rewardService");


// ========================================
// GET REWARD DASHBOARD
// ========================================

const getRewardDashboard = async(req,res)=>{

    try{


        const totalRewards =
            await UserReward.countDocuments();


        const totalUsersRewarded =
            await UserReward.distinct("user");


        const totalAchievements =
            await Achievement.countDocuments();


        const totalBadges =
            await Badge.countDocuments();



        const recentRewards =
            await UserReward.find()
            .populate(
                "user",
                "name email"
            )
            .populate(
                "achievement",
                "title category"
            )
            .populate(
                "badge",
                "title icon"
            )
            .sort({
                createdAt:-1
            })
            .limit(10);



        res.status(200).json({

            success:true,

            dashboard:{

                totalRewards,

                totalUsersRewarded:
                totalUsersRewarded.length,

                totalAchievements,

                totalBadges,

                recentRewards

            }

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



// ========================================
// GET ALL USER REWARDS
// ========================================

const getAllRewards = async(req,res)=>{

    try{


        const rewards =
        await UserReward.find()

        .populate(
            "user",
            "name email"
        )

        .populate(
            "achievement",
            "title category target"
        )

        .populate(
            "badge",
            "title icon"
        )

        .sort({
            createdAt:-1
        });



        res.status(200).json({

            success:true,

            count:
            rewards.length,

            rewards

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};



// ========================================
// GET SINGLE REWARD
// ========================================


const getRewardById = async(req,res)=>{

    try{


        const reward =
        await UserReward.findById(
            req.params.id
        )

        .populate(
            "user",
            "name email"
        )

        .populate(
            "achievement"
        )

        .populate(
            "badge"
        );



        if(!reward){

            return res.status(404).json({

                success:false,

                message:"Reward not found"

            });

        }



        res.status(200).json({

            success:true,

            reward

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



// ========================================
// DELETE REWARD
// ========================================

const deleteReward = async(req,res)=>{

    try{


        const reward =
        await UserReward.findById(
            req.params.id
        );


        if(!reward){

            return res.status(404).json({

                success:false,

                message:"Reward not found"

            });

        }



        await reward.deleteOne();



        res.status(200).json({

            success:true,

            message:
            "Reward deleted successfully"

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



const giveReward = async (req, res) => {
  try {
    const { userId, achievementId, badgeId, rewardPoints } = req.body;
    const result = await createReward({
      userId,
      achievementId,
      badgeId,
      rewardPoints: Number(rewardPoints) || 0
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Reward assigned successfully",
      reward: result.reward
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports={

    getRewardDashboard,

    getAllRewards,

    getRewardById,

    deleteReward,

    giveReward

};