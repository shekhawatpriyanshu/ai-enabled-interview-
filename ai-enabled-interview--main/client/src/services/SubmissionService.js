import API from "../api/axios";

//--------------------------------
// My submissions
//--------------------------------
export const getMySubmissions = async()=>{
    const response = await API.get("/submissions/my");
    return response.data;
};

//--------------------------------
// Details
//--------------------------------
export const getSubmissionDetails = async(id)=>{
    const response = await API.get(`/submissions/${id}`);
    return response.data;
};

//--------------------------------
// Problem Submissions
//--------------------------------
export const getProblemSubmissions = async(problemId)=>{
    const response = await API.get(`/submissions/problem/${problemId}`);
    return response.data;
};

//--------------------------------
// Stats
//--------------------------------
export const getCodingStats = async()=>{
    const response = await API.get("/submissions/stats");
    return response.data;
};
