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
            message: result.compile_output || "Compilation failed",
            time: result.time || 0,
            memory: result.memory || 0
        };
    }

    //--------------------------------
    // Runtime Error
    //--------------------------------
    if (status === "Runtime Error") {
        return {
            success: false,
            type: "RUNTIME_ERROR",
            message: result.stderr || "Runtime exception",
            time: result.time || 0,
            memory: result.memory || 0
        };
    }

    //--------------------------------
    // Time Limit Exceeded
    //--------------------------------
    if (status === "Time Limit Exceeded") {
        return {
            success: false,
            type: "TIME_LIMIT",
            message: "Execution time exceeded",
            time: result.time || 0,
            memory: result.memory || 0
        };
    }

    //--------------------------------
    // Memory Limit Exceeded
    //--------------------------------
    if (status === "Memory Limit Exceeded") {
        return {
            success: false,
            type: "MEMORY_LIMIT",
            message: "Memory limit exceeded",
            time: result.time || 0,
            memory: result.memory || 0
        };
    }

    //--------------------------------
    // Successful Execution
    //--------------------------------
    return {
        success: true,
        type: "SUCCESS",
        output: (result.stdout || "").trim(),

        // IMPORTANT
        time: result.time || 0,
        memory: result.memory || 0
    };
}

module.exports = {
    processJudgeResult
};