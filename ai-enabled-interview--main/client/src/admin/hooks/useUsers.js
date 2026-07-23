import { useEffect, useState } from "react";

import {
  getUsers,
  deleteUser,
  changeStatus,
  changeRole,
  getUserStats,
} from "../services/userService";

const useUsers = () => {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({});

  const [pagination, setPagination] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filters, setFilters] =
    useState({
      page: 1,
      limit: 10,
      search: "",
      role: "",
      verified: "",
      blocked: "",
      sort: "newest",
    });

  /*
  =============================================
            LOAD USERS
  =============================================
  */

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers(filters);

      setUsers(res.users);

      setPagination(res.pagination);

      setError("");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =============================================
            LOAD STATS
  =============================================
  */

  const loadStats = async () => {
    try {
      const res =
        await getUserStats();

      setStats(res.stats);
    } catch (err) {
      console.log(err);
    }
  };

  /*
  =============================================
            DELETE USER
  =============================================
  */

  const removeUser = async (id) => {
    try {
      await deleteUser(id);

      loadUsers();

      loadStats();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  /*
  =============================================
            BLOCK USER
  =============================================
  */

  const toggleBlock = async (id) => {
    try {
      await changeStatus(id);

      loadUsers();

      loadStats();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Action failed"
      );
    }
  };

  /*
  =============================================
            CHANGE ROLE
  =============================================
  */

  const updateRole = async (
    id,
    role
  ) => {
    try {
      await changeRole(id, role);

      loadUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to update role"
      );
    }
  };

  /*
  =============================================
            SEARCH
  =============================================
  */

  const searchUsers = (
    keyword
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: keyword,
    }));
  };

  /*
  =============================================
            ROLE FILTER
  =============================================
  */

  const filterRole = (role) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      role,
    }));
  };

  /*
  =============================================
            VERIFIED FILTER
  =============================================
  */

  const filterVerified = (
    verified
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      verified,
    }));
  };

  /*
  =============================================
            BLOCK FILTER
  =============================================
  */

  const filterBlocked = (
    blocked
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      blocked,
    }));
  };

  /*
  =============================================
            SORT
  =============================================
  */

  const sortUsers = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }));
  };

  /*
  =============================================
            PAGE
  =============================================
  */

  const changePage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, []);

  return {
    users,
    stats,
    pagination,
    loading,
    error,

    filters,

    searchUsers,
    filterRole,
    filterVerified,
    filterBlocked,
    sortUsers,
    changePage,

    removeUser,
    toggleBlock,
    updateRole,

    refreshUsers: loadUsers,
  };
};

export default useUsers;