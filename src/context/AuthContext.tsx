import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { registerUnauthorizedHandler } from "../api/client";

const TOKEN_KEY = "techstore_token";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();

  function loginWithToken(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate("/login");
  }

  // Registra el handler de 401 una sola vez: si el interceptor de axios
  // detecta un token expirado/inválido, hace logout automático.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      navigate("/login?expired=1");
    });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
