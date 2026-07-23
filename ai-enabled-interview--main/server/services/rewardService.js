const UserReward = require("../models/userReward");


// ========================================
// CREATE USER REWARD
// ========================================

const createReward = async ({
    userId,
    achievementId,
    badgeId,
    rewardPoints = 0
}) => {


    try {


        // Check duplicate reward

        const existingReward =
            await UserReward.findOne({

                user:userId,

                achievement:
                achievementId

            });



        if(existingReward){

            return {

                success:false,

                message:
                "Reward already assigned",

                reward:
                existingReward

            };

        }



        // Create Reward

        const reward =
        await UserReward.create({

            user:userId,

            achievement:
            achievementId,

            badge:
            badgeId,

            rewardPoints

        });



        return {

            success:true,

            reward

        };



    }
    catch(error){


        console.log(
            "Reward creation error:",
            error.message
        );


        return {

            success:false,

            message:
            error.message

        };


    }


};




// ========================================
// GET USER TOTAL XP
// ========================================

const getUserTotalRewards =
async(userId)=>{


    const rewards =
    await UserReward.find({

        user:userId

    });



    let totalPoints = 0;



    rewards.forEach(
        reward=>{

            totalPoints +=
            reward.rewardPoints || 0;

        }
    );



    return totalPoints;


};




// ========================================
// REMOVE REWARD
// ========================================

const removeReward =
async(rewardId)=>{


    const reward =
    await UserReward.findById(
        rewardId
    );


    if(!reward){

        return {

            success:false,

            message:
            "Reward not found"

        };

    }



    await reward.deleteOne();



    return {

        success:true,

        message:
        "Reward removed"

    };


};



module.exports = {


    createReward,

    getUserTotalRewards,

    removeReward

};