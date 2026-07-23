import { useContext } from "react";
import QuestionContext from "../context/QuestionContext";
import questionService from "../services/questionService";

const useQuestion = () => {
  const context = useContext(QuestionContext);

  // ===========================
  // Questions
  // ===========================

  const fetchQuestions = async (params = {}) => {
    try {
      context.setLoading(true);

      const res = await questionService.getQuestions(params);

      context.setQuestions(res.data.questions);

      return res.data;
    } finally {
      context.setLoading(false);
    }
  };

  const fetchQuestion = async (id) => {
    try {
      context.setLoading(true);

      const res = await questionService.getQuestion(id);

      context.setQuestion(res.data.question);

      return res.data.question;
    } finally {
      context.setLoading(false);
    }
  };

  const addQuestion = async (data) => {
    const res = await questionService.createQuestion(data);

    await fetchQuestions();

    return res.data;
  };

  const editQuestion = async (id, data) => {
    const res = await questionService.updateQuestion(id, data);

    await fetchQuestions();

    return res.data;
  };

  const removeQuestion = async (id) => {
    const res = await questionService.deleteQuestion(id);

    await fetchQuestions();

    return res.data;
  };

  // ===========================
  // Topics
  // ===========================

  const fetchTopics = async () => {
    const res = await questionService.getTopics();

    context.setTopics(res.data.topics);

    return res.data.topics;
  };

  const addTopic = async (data) => {
    const res = await questionService.createTopic(data);

    await fetchTopics();

    return res.data;
  };

  const updateTopic = async (id, data) => {
    const res = await questionService.updateTopic(id, data);

    await fetchTopics();

    return res.data;
  };

  const removeTopic = async (id) => {
    const res = await questionService.deleteTopic(id);

    await fetchTopics();

    return res.data;
  };

  // ===========================
  // Companies
  // ===========================

  const fetchCompanies = async () => {
    const res = await questionService.getCompanies();

    context.setCompanies(res.data.companies);

    return res.data.companies;
  };

  const addCompany = async (data) => {
    const res = await questionService.createCompany(data);

    await fetchCompanies();

    return res.data;
  };

  const updateCompany = async (id, data) => {
    const res = await questionService.updateCompany(id, data);

    await fetchCompanies();

    return res.data;
  };

  const removeCompany = async (id) => {
    const res = await questionService.deleteCompany(id);

    await fetchCompanies();

    return res.data;
  };

  return {
    ...context,

    fetchQuestions,
    fetchQuestion,

    addQuestion,
    editQuestion,
    removeQuestion,

    fetchTopics,
    addTopic,
    updateTopic,
    removeTopic,

    fetchCompanies,
    addCompany,
    updateCompany,
    removeCompany,
  };
};

export default useQuestion;