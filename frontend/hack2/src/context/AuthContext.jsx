import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const getInitialUser = () => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  return storedUser && token ? JSON.parse(storedUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, ...userData } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const { token, ...user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getProfile, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
