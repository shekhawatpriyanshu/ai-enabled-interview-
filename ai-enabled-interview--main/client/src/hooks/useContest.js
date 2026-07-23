import { useContext } from "react";
import { ContestContext } from "../context/ContestContext";

const useContest = () => {
  const context = useContext(ContestContext);

  if (!context) {
    throw new Error(
      "useContest must be used within a ContestProvider"
    );
  }

  return context;
};

export default useContest;