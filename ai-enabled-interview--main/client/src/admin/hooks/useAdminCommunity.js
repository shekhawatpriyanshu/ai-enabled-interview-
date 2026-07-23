import { useState } from "react";

import toast from "react-hot-toast";

import AdminCommunityService from "../services/AdminCommunityService";



const useAdminCommunity = ()=>{


const [loading,setLoading]=useState(false);

const [data,setData]=useState(null);





const handleRequest = async(
    apiCall
)=>{

try{


setLoading(true);


const response =
await apiCall();


setData(
response.data
);


return response.data;


}
catch(error){


toast.error(

error.response?.data?.message ||
"Something went wrong"

);


}
finally{

setLoading(false);

}


};





// Dashboard

const getDashboard = ()=>{

return handleRequest(
()=>AdminCommunityService.getDashboard()
);

};

const getAnalytics = ()=>{

return handleRequest(
()=>AdminCommunityService.getAnalytics()
);

};




// Discussions

const getDiscussions=(params)=>{

return handleRequest(
()=>AdminCommunityService.getDiscussions(params)
);

};



const deleteDiscussion=(id)=>{

return handleRequest(
()=>AdminCommunityService.deleteDiscussion(id)
);

};





// Comments

const getComments=(params)=>{

return handleRequest(
()=>AdminCommunityService.getComments(params)
);

};



const deleteComment=(id)=>{

return handleRequest(
()=>AdminCommunityService.deleteComment(id)
);

};






// Groups

const getGroups=(params)=>{

return handleRequest(
()=>AdminCommunityService.getGroups(params)
);

};



const deleteGroup=(id)=>{

return handleRequest(
()=>AdminCommunityService.deleteGroup(id)
);

};




const updateGroup=(id,data)=>{

return handleRequest(
()=>AdminCommunityService.updateGroup(id,data)
);

};

const getGroupById = (id) => {
  return handleRequest(() => AdminCommunityService.getGroupById(id));
};

const getGroupMembers = (id) => {
  return handleRequest(() => AdminCommunityService.getGroupMembers(id));
};

const removeMember = (groupId, userId) => {
  return handleRequest(() => AdminCommunityService.removeMember(groupId, userId));
};





// Messages


const getMessages=(params)=>{

return handleRequest(
()=>AdminCommunityService.getMessages(params)
);

};



const deleteMessage=(id)=>{

return handleRequest(
()=>AdminCommunityService.deleteMessage(id)
);

};





return {


loading,

data,


getDashboard,

getAnalytics,


getDiscussions,

deleteDiscussion,


getComments,

deleteComment,


getGroups,

getGroupById,

deleteGroup,

updateGroup,

getGroupMembers,

removeMember,


getMessages,

deleteMessage


};



};


export default useAdminCommunity;