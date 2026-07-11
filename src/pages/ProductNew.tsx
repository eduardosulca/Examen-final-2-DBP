import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/products";
import { parseApiError, type AppError } from "../api/errors";
import type { ProductRequest } from "../types";
import ProductForm from "../components/ProductForm";
import ErrorBanner from "../components/ErrorBanner";

export default function ProductNew() {
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(data: ProductRequest) {
    setError(null);
    setLoading(true);
    try {
      await createProduct(data);
      navigate("/");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-white mb-1">Nuevo producto</h1>
      <p className="text-white/50 text-sm mb-8 font-body">Agrega un producto al catálogo</p>

      {error && (
        <div className="mb-6 max-w-xl">
          <ErrorBanner error={error} />
        </div>
      )}

      <ProductForm submitLabel="Crear producto" loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}
