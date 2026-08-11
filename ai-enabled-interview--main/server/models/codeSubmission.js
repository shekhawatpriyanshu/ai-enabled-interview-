const mongoose=require("mongoose");

const submissionSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

problem:{
type:mongoose.Schema.Types.ObjectId,
ref:"CodingProblem",
required:true
},

language:{
type:String,
required:true
},

sourceCode:{
type:String,
required:true
},

status:{
type:String,
enum:[
"Accepted",
"Wrong Answer",
"WRONG_ANSWER",
"COMPILATION_ERROR",
"RUNTIME_ERROR",
"TIME_LIMIT",
"MEMORY_LIMIT",
"SUCCESS"
]
},

executionTime:Number,
memoryUsed:Number,
testCasesPassed:Number,
totalTestCases:Number,

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model(
"CodeSubmission",
submissionSchema
);