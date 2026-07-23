import {
  createContext,
  useState,
  useCallback,
} from "react";

import {
  getContests,
  getContest,
  createContest,
  joinContest,
  submitContest,
  getLeaderboard,
  getMyContests,
} from "../services/ContestService";

export const ContestContext =
  createContext();

export const ContestProvider = ({
  children,
}) => {
  const [contests, setContests] =
    useState([]);

  const [contest, setContest] =
    useState(null);

  const [leaderboard, setLeaderboard] =
    useState([]);

  const [myContests, setMyContests] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // ===========================
  // Load All Contests
  // ===========================

  const loadContests =
    useCallback(async () => {
      try {
        setLoading(true);

        const res =
          await getContests();

        setContests(
          res.contests || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===========================
  // Load Single Contest
  // ===========================

  const loadContest =
    useCallback(async (id) => {
      try {
        setLoading(true);

        const res =
          await getContest(id);

        setContest(
          res.contest
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===========================
  // Create Contest
  // ===========================

  const createNewContest =
    async (contestData) => {
      try {
        setLoading(true);

        const res =
          await createContest(
            contestData
          );

        setContests((prev) => [
          res.contest,
          ...prev,
        ]);

        return res;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

  // ===========================
  // Join Contest
  // ===========================

  const joinContestById =
    async (contestId) => {
      try {
        setLoading(true);

        const res =
          await joinContest(
            contestId
          );

        return res;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

  // ===========================
  // Submit Contest
  // ===========================

  const submitContestResult =
    async (
      contestId,
      submission
    ) => {
      try {
        setLoading(true);

        const res =
          await submitContest(
            contestId,
            submission
          );

        return res;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

  // ===========================
  // Leaderboard
  // ===========================

  const loadLeaderboard =
    useCallback(async (id) => {
      try {
        setLoading(true);

        const res =
          await getLeaderboard(id);

        setLeaderboard(
          res.leaderboard || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===========================
  // My Contests
  // ===========================

  const loadMyContests =
    useCallback(async () => {
      try {
        setLoading(true);

        const res =
          await getMyContests();

        setMyContests(
          res.contests || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  return (
    <ContestContext.Provider
      value={{
        contests,
        contest,
        leaderboard,
        myContests,
        loading,

        loadContests,
        loadContest,
        createNewContest,
        joinContestById,
        submitContestResult,
        loadLeaderboard,
        loadMyContests,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};