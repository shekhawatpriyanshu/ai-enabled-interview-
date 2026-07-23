import { useState } from "react";
import toast from "react-hot-toast";

import ContestService from "../services/ContestService";

const useContest = () => {
  const [loading, setLoading] = useState(false);

  const [contests, setContests] = useState([]);

  const [contest, setContest] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);

  // =====================================
  // Get All Contests
  // =====================================
  const loadContests = async () => {
    try {
      setLoading(true);

      const res =
        await ContestService.getContests();

      setContests(res.contests || []);

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load contests."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Get Contest
  // =====================================
  const loadContest = async (id) => {
    try {
      setLoading(true);

      const res =
        await ContestService.getContest(id);

      setContest(res.contest);

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load contest."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Create Contest
  // =====================================
  const addContest = async (contestData) => {
    try {
      setLoading(true);

      const res =
        await ContestService.createContest(
          contestData
        );

      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Update Contest
  // =====================================
  const editContest = async (
    id,
    contestData
  ) => {
    try {
      setLoading(true);

      const res =
        await ContestService.updateContest(
          id,
          contestData
        );

      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Contest
  // =====================================
  const removeContest = async (id) => {
    try {
      setLoading(true);

      const res =
        await ContestService.deleteContest(
          id
        );

      setContests((prev) =>
        prev.filter(
          (contest) =>
            contest._id !== id
        )
      );

      toast.success(
        "Contest deleted successfully."
      );

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete contest."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Participants
  // =====================================
  const loadParticipants = async (id) => {
    try {
      setLoading(true);

      const res =
        await ContestService.getParticipants(
          id
        );

      setParticipants(
        res.participants || []
      );

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load participants."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Leaderboard
  // =====================================
  const loadLeaderboard = async (id) => {
    try {
      setLoading(true);

      const res =
        await ContestService.getLeaderboard(
          id
        );

      setLeaderboard(
        res.leaderboard || []
      );

      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load leaderboard."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    contests,
    contest,
    participants,
    leaderboard,

    loadContests,
    loadContest,

    addContest,
    editContest,
    removeContest,

    loadParticipants,
    loadLeaderboard,
  };
};

export default useContest;