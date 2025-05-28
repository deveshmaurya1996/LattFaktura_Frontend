// src/contexts/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "../lib/axiosInstance";
import { endpoints } from "../constants/endpoints";
import Cookies from "js-cookie";
// Constants
const TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);

          const result = await fetchProfile();
          if (!result.success) {
            setAuthError(result.error);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setAuthError(
            "Failed to initialize user session. Please log in again."
          );
          Cookies.remove(TOKEN_KEY);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error("No token found");
      }
      Cookies.set(TOKEN_KEY, token, { expires: 30 });
      const response = await axios.get(endpoints.profile.url);
      const userData = response.data.user;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
      setAuthError(null);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Cookies.remove(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile.";
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const response = await axios.post(endpoints.login.url, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      Cookies.set(TOKEN_KEY, token, { expires: 30 });
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (userData) => {
    setIsRegistering(true);
    setAuthError(null);

    try {
      const response = await axios.post(endpoints.register.url, userData);
      const { token, user } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      Cookies.set(TOKEN_KEY, token, { expires: 30 });
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
    setAuthError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    authError,
    isLoggingIn,
    isRegistering,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
