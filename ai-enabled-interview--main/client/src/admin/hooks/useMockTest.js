import { useState } from "react";
import toast from "react-hot-toast";

import MockTestService from "../services/MockTestService";

const useMockTest = () => {
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================
  // Get All Mock Tests
  // ==========================
  const loadMockTests = async (params = {}) => {
    try {
      setLoading(true);

      const res = await MockTestService.getMockTests(params);

      setTests(res.tests || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load mock tests."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Get Mock Test By Id
  // ==========================
  const loadMockTest = async (id) => {
    try {
      setLoading(true);

      const res = await MockTestService.getMockTestById(id);

      setTest(res.test);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load mock test."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Create Mock Test
  // ==========================
  const addMockTest = async (data) => {
    try {
      setLoading(true);

      const res = await MockTestService.createMockTest(data);

      toast.success("Mock Test created successfully.");

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create mock test."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Update Mock Test
  // ==========================
  const editMockTest = async (id, data) => {
    try {
      setLoading(true);

      const res = await MockTestService.updateMockTest(
        id,
        data
      );

      toast.success("Mock Test updated successfully.");

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update mock test."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete Mock Test
  // ==========================
  const removeMockTest = async (id) => {
    try {
      setLoading(true);

      const res = await MockTestService.deleteMockTest(id);

      toast.success("Mock Test deleted successfully.");

      setTests((prev) =>
        prev.filter((item) => item._id !== id)
      );

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete mock test."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Load Questions
  // ==========================
  const loadQuestions = async () => {
    try {
      setLoading(true);

      const res = await MockTestService.getQuestions();

      setQuestions(res.questions || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    tests,
    test,
    questions,

    loadMockTests,
    loadMockTest,
    addMockTest,
    editMockTest,
    removeMockTest,
    loadQuestions,
  };
};

export default useMockTest;