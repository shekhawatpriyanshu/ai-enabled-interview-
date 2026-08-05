const Submission = require("../models/codeSubmission");

//------------------------------------
// Get Logged User Submissions
//------------------------------------
exports.getMySubmissions = async(req,res)=>{
    try{
        const submissions = await Submission.find({
            user:req.user._id
        })
        .populate("problem", "title difficulty")
        .sort({ createdAt:-1 });

        return res.json({
            success:true,
            submissions
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Unable to fetch submissions"
        });
    }
};

//------------------------------------
// Submission Details
//------------------------------------
exports.getSubmissionDetails = async(req,res)=>{
    try{
        const submission = await Submission.findById(req.params.id)
            .populate("problem");

        if(!submission){
            return res.status(404).json({
                success:false,
                message: "Submission not found"
            });
        }

        // Security check
        if(submission.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message: "Not allowed"
            });
        }

        return res.json({
            success:true,
            submission
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Server error"
        });
    }
};

//------------------------------------
// Get Problem Submissions
//------------------------------------
exports.getProblemSubmissions = async(req,res)=>{
    try{
        const submissions = await Submission.find({
            user:req.user._id,
            problem:req.params.problemId
        })
        .sort({ createdAt:-1 });

        res.json({
            success:true,
            submissions
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

//------------------------------------
// Coding Stats
//------------------------------------
exports.getCodingStats = async(req,res)=>{
    try{
        const submissions = await Submission.find({
            user:req.user._id
        });

        const totalSubmissions = submissions.length;
        const accepted = submissions.filter(s=>s.status==="Accepted").length;
        const wrong = submissions.filter(s=>s.status!=="Accepted").length;

        const languages={};
        submissions.forEach((sub)=>{
            if(!languages[sub.language]){
                languages[sub.language]=0;
            }
            languages[sub.language]++;
        });

        res.json({
            success:true,
            stats:{
                totalSubmissions,
                accepted,
                wrong,
                languages
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
