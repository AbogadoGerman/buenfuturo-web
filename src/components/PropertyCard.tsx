"use client";

import Image from "next/image";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Property {
  nid: string;
  barrio: string;
  precio: number;          // número en pesos COP
  area_m2?: number;
  habitaciones?: number;
  banos?: number;
  estrato?: number;
  url_360?: string;
  images: string[];        // array de URLs; puede estar vacío
  descripcion?: string;
}

interface PropertyCardProps {
  property: Property;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLACEHOLDER = "/images/placeholder-property.svg";

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    nid,
    barrio,
    precio,
    area_m2,
    habitaciones,
    banos,
    estrato,
    url_360,
    images,
    descripcion,
  } = property;

  const mainImage = images && images.length > 0 ? images[0] : PLACEHOLDER;

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* ── Imagen principal ── */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt={`Apartamento ${nid} en ${barrio}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
        {/* Badge de estrato */}
        {estrato && (
          <span className="absolute top-3 left-3 bg-white/90 text-secondary text-xs font-semibold px-2 py-1 rounded-full shadow">
            Estrato {estrato}
          </span>
        )}
        {/* Badge cantidad de fotos */}
        {images.length > 1 && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            📷 {images.length}
          </span>
        )}
      </div>

      {/* ── Contenido ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* NID + Barrio */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
              {nid}
            </p>
            <h2 className="text-lg font-bold text-secondary leading-tight mt-0.5">
              {barrio}
            </h2>
          </div>
          {/* Precio */}
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Precio</p>
            <p className="text-base font-extrabold text-primary leading-tight">
              {formatCOP(precio)}
            </p>
          </div>
        </div>

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {descripcion}
          </p>
        )}

        {/* Specs */}
        {(area_m2 || habitaciones || banos) && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
            {area_m2 && (
              <span className="flex items-center gap-1">
                <span className="text-primary">📐</span> {area_m2} m²
              </span>
            )}
            {habitaciones && (
              <span className="flex items-center gap-1">
                <span className="text-primary">🛏</span> {habitaciones} hab.
              </span>
            )}
            {banos && (
              <span className="flex items-center gap-1">
                <span className="text-primary">🚿</span> {banos} baños
              </span>
            )}
          </div>
        )}

        {/* ── Sello de Respaldo Jurídico ── */}
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 mt-auto">
          <span className="text-primary text-lg leading-none">⚖️</span>
          <p className="text-xs text-primary font-semibold leading-tight">
            Respaldo Jurídico Incluido
            <span className="block font-normal text-gray-500">
              Revisión de escrituras y contrato sin costo extra.
            </span>
          </p>
        </div>

        {/* ── Botón Tour 360° ── */}
        {url_360 ? (
          <a
            href={url_360}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-primary/30"
          >
            🔴 Ver Tour 360°
          </a>
        ) : (
          <button
            disabled
            className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-bold text-sm py-3 px-4 rounded-xl cursor-not-allowed"
          >
            Tour próximamente
          </button>
        )}
      </div>
    </article>
  );
}