import {
    createContext,
    useState,
} from "react";

const CodingContext =
    createContext();

export const CodingProvider = ({
    children,
}) => {

    const [problems, setProblems] =
        useState([]);

    const [problem, setProblem] =
        useState(null);

    const [dashboard, setDashboard] =
        useState({});

    const [analytics, setAnalytics] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    return (

        <CodingContext.Provider

            value={{

                problems,

                setProblems,

                problem,

                setProblem,

                dashboard,

                setDashboard,

                analytics,

                setAnalytics,

                loading,

                setLoading,

            }}

        >

            {children}

        </CodingContext.Provider>

    );

};

export default CodingContext;