import axios from "axios";

const API =
  "http://localhost:3000/api/questions";

const getToken = () =>
  localStorage.getItem("token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});


// --------------------
// Topics
// --------------------

export const getTopics = async () => {
  const res = await axios.get(
    `${API}/topics`
  );
  return res.data;
};

export const createTopic = async (
  data
) => {
  const res = await axios.post(
    `${API}/topic/create`,
    data,
    authConfig()
  );

  return res.data;
};


// --------------------
// Companies
// --------------------

export const getCompanies =
  async () => {
    const res = await axios.get(
      `${API}/companies`
    );

    return res.data;
  };

export const createCompany =
  async (data) => {
    const res = await axios.post(
      `${API}/company/create`,
      data,
      authConfig()
    );

    return res.data;
  };


// --------------------
// Questions
// --------------------

export const getQuestions =
  async () => {
    const res = await axios.get(API);

    return res.data;
  };

export const getQuestion =
  async (id) => {
    const res = await axios.get(
      `${API}/${id}`
    );

    return res.data;
  };

export const createQuestion =
  async (data) => {
    const res = await axios.post(
      `${API}/create`,
      data,
      authConfig()
    );

    return res.data;
  };

export const updateQuestion =
  async (id, data) => {
    const res = await axios.put(
      `${API}/update/${id}`,
      data,
      authConfig()
    );

    return res.data;
  };

export const deleteQuestion =
  async (id) => {
    const res = await axios.delete(
      `${API}/delete/${id}`,
      authConfig()
    );

    return res.data;
  };