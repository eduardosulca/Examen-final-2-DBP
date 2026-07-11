import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProduct, getProductById, updateProduct } from "../api/products";
import { parseApiError, type AppError } from "../api/errors";
import type { Product, ProductRequest } from "../types";
import ProductForm from "../components/ProductForm";
import ErrorBanner from "../components/ErrorBanner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(true);

  const [saveError, setSaveError] = useState<AppError | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteError, setDeleteError] = useState<AppError | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setLoadError({ kind: "notFound", message: "ID de producto inválido." });
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    getProductById(productId)
      .then(setProduct)
      .catch((err) => setLoadError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleUpdate(data: ProductRequest) {
    setSaveError(null);
    setSaving(true);
    try {
      const updated = await updateProduct(productId, data);
      setProduct(updated);
      navigate("/");
    } catch (err) {
      setSaveError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteProduct(productId);
      navigate("/");
    } catch (err) {
      setDeleteError(parseApiError(err));
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-white mb-1">Editar producto</h1>
      <p className="text-white/50 text-sm mb-8 font-body">Actualiza o elimina este producto del catálogo</p>

      {loading && <p className="text-white/50 font-body">Cargando producto...</p>}

      {!loading && loadError && (
        <div className="max-w-xl">
          <ErrorBanner error={loadError} />
        </div>
      )}

      {!loading && !loadError && product && (
        <>
          {saveError && (
            <div className="mb-6 max-w-xl">
              <ErrorBanner error={saveError} />
            </div>
          )}

          <ProductForm
            initialValue={{
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price,
              stock: product.stock,
              imageUrl: product.imageUrl,
              availability: product.availability,
            }}
            submitLabel="Guardar cambios"
            loading={saving}
            onSubmit={handleUpdate}
          />

          <div className="mt-10 max-w-xl border-t border-edge pt-6">
            {deleteError && (
              <div className="mb-4">
                <ErrorBanner error={deleteError} />
              </div>
            )}
            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="rounded-md border border-danger/40 text-danger px-4 py-2 text-sm hover:bg-danger/10 transition"
              >
                Eliminar producto
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70 font-body">¿Seguro que quieres eliminarlo?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:brightness-90 transition disabled:opacity-50"
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
