//----------------------------------------------------
// Judge0 Result Processor
//----------------------------------------------------

function processJudgeResult(result) {

    const status = result.status?.description;

    //--------------------------------
    // Compilation Error
    //--------------------------------
    if (status === "Compilation Error") {
        return {
            success: false,
            type: "COMPILATION_ERROR",
            message: result.compile_output || "Compilation failed"
        };
    }

    //--------------------------------
    // Runtime Error
    //--------------------------------
    if (status === "Runtime Error") {
        return {
            success: false,
            type: "RUNTIME_ERROR",
            message: result.stderr || "Runtime exception"
        };
    }

    //--------------------------------
    // Time Limit Exceeded
    //--------------------------------
    if (status === "Time Limit Exceeded") {
        return {
            success: false,
            type: "TIME_LIMIT",
            message: "Execution time exceeded"
        };
    }

    //--------------------------------
    // Memory Limit
    //--------------------------------
    if (status === "Memory Limit Exceeded") {
        return {
            success: false,
            type: "MEMORY_LIMIT",
            message: "Memory limit exceeded"
        };
    }

    //--------------------------------
    // Successful Execution
    //--------------------------------
    return {
        success: true,
        type: "SUCCESS",
        output: (result.stdout || "").trim()
    };

}

module.exports = {
    processJudgeResult
};
