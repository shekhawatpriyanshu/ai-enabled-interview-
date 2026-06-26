import API from "../api/axios";

export const uploadResume =
  async (formData) => {
    const res =
      await API.post(
        "/resumes/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

export const analyzeResume =
  async (
    id,
    role
  ) => {
    const res =
      await API.post(
        `/resumes/analyze/${id}`,
        {
          role,
        }
      );

    return res.data;
  };

export const getAnalysis =
  async (id) => {
    const res =
      await API.get(
        `/resumes/analysis/${id}`
      );

    return res.data;
  };