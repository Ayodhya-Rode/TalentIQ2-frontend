import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, { setAccessToken, getAccessToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On app load, try refreshing to see if a valid refresh cookie exists
    const tryRestoreSession = async () => {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        setAccessToken(res.data.data.accessToken);
        await fetchMe();
      } catch {
        setLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    setAccessToken(res.data.data.accessToken);
    await fetchMe();
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);