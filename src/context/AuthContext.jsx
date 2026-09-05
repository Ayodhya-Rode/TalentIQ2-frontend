import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider mounted, restoring session...");
    const tryRestoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh");

        setAccessToken(res.data.data.accessToken);

        await fetchMe();
      } catch {
        setAccessToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setAccessToken(res.data.data.accessToken);

    await fetchMe();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
