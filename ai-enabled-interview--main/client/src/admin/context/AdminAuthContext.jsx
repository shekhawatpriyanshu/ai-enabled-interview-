import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import adminApi from "../services/adminApi";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({
  children,
}) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin =
      localStorage.getItem("admin");

    return savedAdmin
      ? JSON.parse(savedAdmin)
      : null;
  });

  const [loading, setLoading] =
    useState(true);

  // ===========================
  // Admin Login
  // ===========================

  const login = async (
    email,
    password
  ) => {
    const res = await adminApi.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "adminToken",
      res.data.token
    );

    localStorage.setItem(
      "admin",
      JSON.stringify(res.data.admin)
    );

    setAdmin(res.data.admin);

    return res.data;
  };

  // ===========================
  // Get Logged In Admin
  // ===========================

  const getProfile = async () => {
    try {
      const res =
        await adminApi.get("/auth/me");

      setAdmin(res.data.admin);

      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.admin)
      );
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Logout
  // ===========================

  const logout = async () => {
    try {
      await adminApi.post("/auth/logout");
    } catch (error) {}

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem("admin");

    setAdmin(null);
  };

  // ===========================
  // Auto Login
  // ===========================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "adminToken"
      );

    if (token) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        getProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () =>
  useContext(AdminAuthContext);