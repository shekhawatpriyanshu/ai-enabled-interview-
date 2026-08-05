const {
    createSubmission,
    waitForResult
} = require("../services/judge0Service");

const {
    generateWrapper
} = require("../services/wrapperService");

const CodingProblem = require("../models/codingProblem");

const languageMap={
    javascript:102,
    python:100,
    java:91,
    cpp:105
};

//---------------------------------------
// Run Code
//---------------------------------------
exports.runCode = async(req,res)=>{
    try{
        const {
            problemId,
            language,
            code,
            input
        }=req.body;

        const problem = await CodingProblem.findById(problemId);

        if(!problem){
            return res.status(404).json({
                success:false,
                message:"Problem not found"
            });
        }

        // Generate wrapper
        const wrappedCode = generateWrapper(
            language,
            code,
            problem
        );

        // Create Judge0 job
        const token = await createSubmission(
            wrappedCode,
            languageMap[language],
            JSON.stringify(input),
            problem.limits
        );

        // Wait result
        const result = await waitForResult(token);

        res.json({
            success:true,
            output: result.stdout || "",
            error: result.stderr || result.compile_output || "",
            status: result.status?.description || "Unknown"
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message: "Run failed"
        });
    }
};
