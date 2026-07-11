import { Link } from "react-router-dom";
import type { Product } from "../types";

const AVAILABILITY_LABEL: Record<Product["availability"], string> = {
  DISPONIBLE: "Disponible",
  AGOTADO: "Agotado",
  PROXIMAMENTE: "Próximamente",
};

const AVAILABILITY_STYLE: Record<Product["availability"], string> = {
  DISPONIBLE: "bg-signal/15 text-signal border-signal/30",
  AGOTADO: "bg-danger/15 text-danger border-danger/30",
  PROXIMAMENTE: "bg-warn/15 text-warn border-warn/30",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col rounded-xl border border-edge bg-panel overflow-hidden hover:border-signal/50 transition"
    >
      <div className="aspect-[4/3] bg-white/5 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-white leading-tight">{product.name}</h3>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-mono ${AVAILABILITY_STYLE[product.availability]}`}
          >
            {AVAILABILITY_LABEL[product.availability]}
          </span>
        </div>
        <p className="text-xs uppercase tracking-wide text-white/40 font-mono">{product.category}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-white">S/ {product.price.toFixed(2)}</span>
          <span className="text-xs text-white/40">Stock: {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
