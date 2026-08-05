const axios = require("axios");

const JUDGE0_URL = "https://ce.judge0.com";

//----------------------------------------------------
// Create Submission
//----------------------------------------------------

async function createSubmission(
    sourceCode,
    languageId,
    stdin,
    limits
){
    const response = await axios.post(
        `${JUDGE0_URL}/submissions`,
        {
            source_code: sourceCode,
            language_id: languageId,
            stdin
        },
        {
            params:{
                base64_encoded:false,
                wait:false
            }
        }
    );

    return response.data.token;
}

//----------------------------------------------------
// Get Result
//----------------------------------------------------

async function getSubmissionResult(token){
    const response = await axios.get(
        `${JUDGE0_URL}/submissions/${token}`,
        {
            params:{
                base64_encoded:false
            }
        }
    );

    return response.data;
}

//----------------------------------------------------
// Poll Until Finished
//----------------------------------------------------

async function waitForResult(token){
    let attempts=0;
    while(attempts < 30){
        const result = await getSubmissionResult(token);

        if(result.status.id >= 3){
            return result;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve,1000));
    }

    return {
        status:{
            description: "Time Limit Exceeded"
        }
    };
}

module.exports={
    createSubmission,
    waitForResult
};
