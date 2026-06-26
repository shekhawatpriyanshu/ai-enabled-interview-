import API from "../api/axios";

export const startInterview =
  async (data) => {
    const res =
      await API.post(
        "/interviews/start",
        data
      );

    return res.data;
  };

export const getMyInterviews =
  async (
    page = 1,
    limit = 10
  ) => {
    const res =
      await API.get(
        `/interviews/my-interviews?page=${page}&limit=${limit}`
      );

    return res.data;
  };

export const getInterview =
  async (id) => {
    const res =
      await API.get(
        `/interviews/${id}`
      );

    return res.data;
  };

export const submitInterview =
  async (
    id,
    questions
  ) => {
    const res =
      await API.post(
        `/interviews/submit/${id}`,
        {
          questions,
        }
      );

    return res.data;
  };

export const getFeedback =
  async (id) => {
    const res =
      await API.get(
        `/interviews/feedback/${id}`
      );

    return res.data;
  };