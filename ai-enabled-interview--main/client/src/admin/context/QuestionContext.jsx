import { createContext, useState } from "react";

const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);

  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(false);

  return (
    <QuestionContext.Provider
      value={{
        questions,
        setQuestions,

        question,
        setQuestion,

        topics,
        setTopics,

        companies,
        setCompanies,

        loading,
        setLoading,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionContext;