import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

// El backend no expone una lista fija de categorías (es un string libre),
// así que se arma dinámicamente a partir de las categorías ya usadas en
// productos existentes, con un pequeño set de respaldo para un catálogo
// nuevo sin productos aún. Siempre se permite "Otra" para escribir una
// categoría nueva.
const FALLBACK_CATEGORIES = ["Laptops", "Celulares", "Accesorios", "Audio", "Gaming", "Componentes"];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [customMode, setCustomMode] = useState(false);

  useEffect(() => {
    getProducts(0, 100)
      .then((res) => {
        const found = Array.from(new Set(res.content.map((p) => p.category))).sort();
        if (found.length > 0) {
          setCategories(Array.from(new Set([...found, ...FALLBACK_CATEGORIES])).sort());
        }
      })
      .catch(() => {
        // silencioso: si falla, se usa el set de respaldo
      });
  }, []);

  useEffect(() => {
    if (value && !categories.includes(value)) {
      setCustomMode(true);
    }
  }, [value, categories]);

  if (customMode) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe la categoría"
          className="input"
        />
        <button
          type="button"
          onClick={() => {
            setCustomMode(false);
            onChange(categories[0] ?? "");
          }}
          className="shrink-0 rounded-md border border-edge px-3 text-sm text-white/60 hover:text-white transition"
        >
          Volver a lista
        </button>
      </div>
    );
  }

  return (
    <select
      required
      value={value}
      onChange={(e) => {
        if (e.target.value === "__custom__") {
          setCustomMode(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
      className="input"
    >
      <option value="" disabled>
        Selecciona una categoría
      </option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
      <option value="__custom__">Otra (escribir)</option>
    </select>
  );
}
