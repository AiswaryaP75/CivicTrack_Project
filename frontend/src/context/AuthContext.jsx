import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("cc_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists in storage, ask the backend who it
  // belongs to. This both validates the token and repopulates `user`
  // after a page refresh.
  useEffect(() => {
    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await authApi.me(token);
        setUser(user);
      } catch {
        // token invalid/expired — clear it
        localStorage.removeItem("cc_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem("cc_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem("cc_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cc_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
