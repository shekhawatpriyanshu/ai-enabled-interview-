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
    cpp:105,
    c:103
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

        // Convert input to line-by-line format the wrapper expects
        let stdinStr = "";
        if (typeof input === "object" && input !== null && !Array.isArray(input)) {
            stdinStr = Object.values(input).map(v =>
                typeof v === "object" ? JSON.stringify(v) : String(v)
            ).join("\n");
        } else if (Array.isArray(input)) {
            stdinStr = JSON.stringify(input);
        } else {
            stdinStr = String(input || "");
        }

        // Create Judge0 job
        const token = await createSubmission(
            wrappedCode,
            languageMap[language],
            stdinStr,
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
