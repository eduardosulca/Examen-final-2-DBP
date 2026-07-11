import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { parseApiError, type AppError } from "../api/errors";
import type { ProductPage } from "../types";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const [data, setData] = useState<ProductPage | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts(page, 10)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(parseApiError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Catálogo</h1>
          <p className="text-white/50 text-sm mt-1 font-body">Explora los productos disponibles en la tienda</p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner error={error} />
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl border border-edge bg-panel animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !error && data && data.content.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-edge py-20 text-center">
          <p className="font-display text-xl text-white">No hay productos todavía</p>
          <p className="text-white/50 text-sm mt-1 font-body">Crea el primero para empezar a construir el catálogo.</p>
        </div>
      )}

      {!loading && !error && data && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            onPrevious={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => (data.last ? p : p + 1))}
          />
        </>
      )}
    </div>
  );
}
