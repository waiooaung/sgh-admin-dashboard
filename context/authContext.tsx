"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { User } from "@/types/user";

interface AuthContextType {
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from cookies
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null,
  );
  const [user, setUser] = useState<User | null>(
    Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null,
  );

  // Login function - stores token and user data
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set("token", newToken, { expires: 1 });
    Cookies.set("user", JSON.stringify(newUser), { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
