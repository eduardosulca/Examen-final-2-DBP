import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { parseApiError, type AppError } from "../api/errors";
import { useAuth } from "../context/AuthContext";
import ErrorBanner from "../components/ErrorBanner";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register({ username, email, password, fullName });
      loginWithToken(res.token);
      navigate("/");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-white mb-1">Crea tu cuenta</h1>
        <p className="text-white/50 text-sm mb-8 font-body">Únete para guardar favoritos y reseñas</p>

        {error && (
          <div className="mb-4">
            <ErrorBanner error={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nombre completo">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
              placeholder="Juan Pérez"
            />
          </Field>
          <Field label="Usuario">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="juan.perez"
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="juan@correo.com"
            />
          </Field>
          <Field label="Contraseña">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-signal py-2.5 font-medium text-ink hover:brightness-95 transition disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50 font-body">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-signal hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">{label}</label>
      {children}
    </div>
  );
}
