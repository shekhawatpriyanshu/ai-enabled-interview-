import { useContext } from "react";

import CodingContext from "../context/CodingContext";

const useCoding = () => {

    return useContext(CodingContext);

};

export default useCoding;