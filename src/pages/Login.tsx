import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../api/auth";
import { parseApiError, type AppError } from "../api/errors";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/ErrorBanner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const expired = params.get("expired") === "1";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ username, password });
      loginWithToken(res.token);
      navigate("/");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-white mb-1">Bienvenido de vuelta</h1>
        <p className="text-white/50 text-sm mb-8 font-body">Inicia sesión para explorar el catálogo</p>

        {expired && !error && (
          <div className="mb-4">
            <ErrorBanner error={{ kind: "auth", message: "Tu sesión expiró. Inicia sesión nuevamente." }} />
          </div>
        )}
        {error && (
          <div className="mb-4">
            <ErrorBanner error={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-edge bg-panel px-3 py-2.5 text-white outline-none focus:border-signal transition"
              placeholder="tu.usuario"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-edge bg-panel px-3 py-2.5 text-white outline-none focus:border-signal transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-signal py-2.5 font-medium text-ink hover:brightness-95 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50 font-body">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-signal hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
