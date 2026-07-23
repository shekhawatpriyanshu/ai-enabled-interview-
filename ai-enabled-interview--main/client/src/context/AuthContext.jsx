import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import socket from "../socket";

import API from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

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
    
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
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
     if (res.data && res.data.token) {
       localStorage.setItem("token", res.data.token);
       localStorage.setItem("user", JSON.stringify(res.data.user));
       setUser(res.data.user);
     }
     return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await API.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    }
    localStorage.removeItem(
      "token"
    );
    localStorage.removeItem(
      "user"
    );
    setUser(null);
  };

  useEffect(() => {
    if (user && user._id) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);