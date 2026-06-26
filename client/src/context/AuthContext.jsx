import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const login = async (
    email,
    password
  ) => {
    const res = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.user);
  };

  const register = async (
    data
  ) => {
     const res= await API.post(
      "/auth/register",
      data
    );
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);