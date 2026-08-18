import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, signupUser } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "scamshield:auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(() => Boolean(readStoredAuth()?.token));

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!auth?.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await getCurrentUser();
        if (!cancelled && response?.user) {
          setAuth(prev => ({ ...prev, user: response.user }));
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setAuth(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      if (auth?.token) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Keep authentication usable in memory if browser storage is unavailable.
    }
  }, [auth]);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    if (!response?.user || !response?.token) throw new Error("Login response was incomplete.");
    setAuth({ user: { ...response.user, role: "Security Analyst" }, token: response.token });
    return response;
  };

  const signup = async (credentials) => {
    const response = await signupUser(credentials);
    if (!response?.user || !response?.token) throw new Error("Signup response was incomplete.");
    setAuth({ user: { ...response.user, role: "Security Analyst" }, token: response.token });
    return response;
  };

  const logout = async () => {
    await logoutUser();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ user: auth?.user || null, token: auth?.token || null, isAuthenticated: !!auth?.token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
