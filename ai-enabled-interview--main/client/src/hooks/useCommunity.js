import { useCommunityContext } from "../context/CommunityContext";

const useCommunity = () => {
  return useCommunityContext();
};

export default useCommunity;