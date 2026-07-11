import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-edge bg-panel/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight text-white">
          Tech<span className="text-signal">Store</span>
        </Link>
        {isAuthenticated && (
          <nav className="flex items-center gap-4 font-body text-sm">
            <Link to="/" className="text-white/70 hover:text-white transition">
              Catálogo
            </Link>
            <Link
              to="/products/new"
              className="rounded-md bg-signal px-3 py-1.5 text-ink font-medium hover:brightness-95 transition"
            >
              + Nuevo producto
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-white/50 hover:text-danger transition"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
