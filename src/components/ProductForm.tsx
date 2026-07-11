import { useState, type FormEvent } from "react";
import type { Availability, ProductRequest } from "../types";
import CategorySelect from "./CategorySelect";

const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "AGOTADO", label: "Agotado" },
  { value: "PROXIMAMENTE", label: "Próximamente" },
];

interface Props {
  initialValue?: ProductRequest;
  submitLabel: string;
  loading: boolean;
  onSubmit: (data: ProductRequest) => void;
}

const EMPTY: ProductRequest = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  availability: "DISPONIBLE",
};

export default function ProductForm({ initialValue, submitLabel, loading, onSubmit }: Props) {
  const [form, setForm] = useState<ProductRequest>(initialValue ?? EMPTY);

  function update<K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
          Nombre del producto
        </label>
        <input
          type="text"
          required
          minLength={1}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="input"
          placeholder="ej. Laptop Gamer X15"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
          Descripción
        </label>
        <textarea
          required
          minLength={1}
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input resize-none"
          placeholder="Describe las características principales..."
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
          Categoría
        </label>
        <CategorySelect value={form.category} onChange={(v) => update("category", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
            Precio (S/)
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
            Stock
          </label>
          <input
            type="number"
            required
            min={0}
            step="1"
            value={form.stock}
            onChange={(e) => update("stock", parseInt(e.target.value, 10) || 0)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
          URL de imagen
        </label>
        <input
          type="text"
          required
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          className="input"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-1.5 font-mono">
          Disponibilidad
        </label>
        <select
          required
          value={form.availability}
          onChange={(e) => update("availability", e.target.value as Availability)}
          className="input"
        >
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-signal py-2.5 font-medium text-ink hover:brightness-95 transition disabled:opacity-50"
      >
        {loading ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
