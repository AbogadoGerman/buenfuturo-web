"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Building2, X } from "lucide-react";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import inventoryData from "@/data/inventory.json";

// ─── Constantes ───────────────────────────────────────────────────────────────
const VINOTINTO = "#800020";
const GRIS_CARBON = "#2D2D2D";

const PRICE_RANGES = [
  { label: "Todos los precios", min: 0, max: Infinity },
  { label: "Menos de $150M", min: 0, max: 150_000_000 },
  { label: "$150M – $300M", min: 150_000_000, max: 300_000_000 },
  { label: "$300M – $500M", min: 300_000_000, max: 500_000_000 },
  { label: "Más de $500M", min: 500_000_000, max: Infinity },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PropertyGrid() {
  const properties: Property[] = inventoryData as Property[];

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);

  // ── Filtrado ──
  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const range = PRICE_RANGES[priceRangeIndex];

    return properties.filter((p) => {
      // Filtro de búsqueda por NID o barrio
      const matchesSearch =
        query === "" ||
        p.nid.toLowerCase().includes(query) ||
        p.barrio.toLowerCase().includes(query);

      // Filtro por rango de precio
      const matchesPrice = p.precio >= range.min && p.precio < range.max;

      return matchesSearch && matchesPrice;
    });
  }, [properties, searchQuery, priceRangeIndex]);

  const hasActiveFilters = searchQuery !== "" || priceRangeIndex !== 0;

  function clearFilters() {
    setSearchQuery("");
    setPriceRangeIndex(0);
  }

  // ── Render ──
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Encabezado ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Building2 size={28} style={{ color: VINOTINTO }} />
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: GRIS_CARBON }}
          >
            Catálogo de Inmuebles
          </h1>
        </div>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Explora nuestra selección exclusiva con respaldo jurídico incluido.
        </p>
      </div>

      {/* ── Barra de filtros ── */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: VINOTINTO }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código o barrio…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2"
              style={
                {
                  "--tw-ring-color": VINOTINTO,
                } as React.CSSProperties
              }
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Selector de rango de precios */}
          <div className="relative sm:w-56">
            <SlidersHorizontal
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: VINOTINTO }}
            />
            <select
              value={priceRangeIndex}
              onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
              className="w-full appearance-none pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none cursor-pointer transition-all duration-200 focus:border-transparent focus:ring-2"
              style={
                {
                  "--tw-ring-color": VINOTINTO,
                } as React.CSSProperties
              }
            >
              {PRICE_RANGES.map((range, i) => (
                <option key={i} value={i}>
                  {range.label}
                </option>
              ))}
            </select>
            {/* Flecha custom */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Resumen de resultados + botón limpiar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {filtered.length === 0
              ? "Sin resultados"
              : `${filtered.length} inmueble${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: VINOTINTO }}
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Grid de propiedades ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.nid} property={property} />
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${VINOTINTO}0D` }}
          >
            <Search size={28} style={{ color: VINOTINTO }} />
          </div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: GRIS_CARBON }}
          >
            No encontramos inmuebles
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mb-4">
            Intenta ajustar tu búsqueda o el rango de precios para ver más
            opciones.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: VINOTINTO }}
          >
            Ver todos los inmuebles
          </button>
        </div>
      )}
    </section>
  );
}