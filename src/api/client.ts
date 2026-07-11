import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://cs2031-2026-1-pc2-techstore-production.up.railway.app";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s -> dispara error de "network/timeout" si el servidor no responde
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token JWT en cada request, si existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("techstore_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Callback registrado por AuthContext para poder reaccionar a un 401
 * (token expirado/inválido) sin crear una dependencia circular entre
 * el cliente axios y el contexto de React.
 */
let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);
