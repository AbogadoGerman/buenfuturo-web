"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Property {
  nid: string;
  barrio: string;
  precio: number;
  area_m2?: number;
  habitaciones?: number;
  banos?: number;
  estrato?: number;
  url_360?: string;
  images: string[];
  descripcion?: string;
}

interface PropertyCardProps {
  property: Property;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const PLACEHOLDER = "/images/placeholder-property.svg";
const VINOTINTO = "#800020";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Modal Tour 360° ─────────────────────────────────────────────────────────
interface Tour360ModalProps {
  url: string;
  barrio: string;
  onClose: () => void;
}

function Tour360Modal({ url, barrio, onClose }: Tour360ModalProps) {
  // Cerrar con tecla Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Tour 360° de ${barrio}`}
    >
      {/* ── Backdrop oscuro translúcido ── */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* ── Contenedor del iframe ── */}
      <div className="relative z-10 w-[90vw] h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Barra superior */}
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}
        >
          <span className="text-white text-sm font-semibold tracking-wide">
            🔴 Tour 360° — {barrio}
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white text-xl font-bold transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: VINOTINTO }}
            aria-label="Cerrar tour 360°"
          >
            ✕
          </button>
        </div>

        {/* iframe inmersivo */}
        <iframe
          src={url}
          title={`Tour virtual 360° de ${barrio}`}
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* ── Animaciones CSS inline ── */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ─── Componente PropertyCard ──────────────────────────────────────────────────
export default function PropertyCard({ property }: PropertyCardProps) {
  const [showTour, setShowTour] = useState(false);

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
    <>
      <article className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
        {/* ── Imagen principal ── */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <Image
            src={mainImage}
            alt={`Propiedad ${nid} en ${barrio}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
            }}
          />
          {/* Badge de estrato */}
          {estrato && (
            <span
              className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow backdrop-blur-sm"
              style={{ color: VINOTINTO }}
            >
              Estrato {estrato}
            </span>
          )}
          {/* Badge cantidad de fotos */}
          {images.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
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
              <h2 className="text-lg font-bold text-gray-800 leading-tight mt-0.5">
                {barrio}
              </h2>
            </div>
            {/* Precio */}
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Precio</p>
              <p
                className="text-base font-extrabold leading-tight"
                style={{ color: VINOTINTO }}
              >
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
                  <span style={{ color: VINOTINTO }}>📐</span> {area_m2} m²
                </span>
              )}
              {habitaciones && (
                <span className="flex items-center gap-1">
                  <span style={{ color: VINOTINTO }}>🛏</span> {habitaciones} hab.
                </span>
              )}
              {banos && (
                <span className="flex items-center gap-1">
                  <span style={{ color: VINOTINTO }}>🚿</span> {banos} baños
                </span>
              )}
            </div>
          )}

          {/* ── Sello de Respaldo Jurídico ── */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 mt-auto"
            style={{
              backgroundColor: `${VINOTINTO}0D`,
              border: `1px solid ${VINOTINTO}33`,
            }}
          >
            <span className="text-lg leading-none">⚖️</span>
            <p
              className="text-xs font-semibold leading-tight"
              style={{ color: VINOTINTO }}
            >
              Respaldo Jurídico Incluido
              <span className="block font-normal text-gray-500 mt-0.5">
                Revisión de escrituras y contrato sin costo extra.
              </span>
            </p>
          </div>

          {/* ── Botón Tour 360° ── */}
          {url_360 ? (
            <button
              onClick={() => setShowTour(true)}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:opacity-90 hover:shadow-lg active:scale-95 cursor-pointer"
              style={{ backgroundColor: VINOTINTO }}
            >
              🔴 Ver Tour 360°
            </button>
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

      {/* ── Modal Tour 360° ── */}
      {showTour && url_360 && (
        <Tour360Modal
          url={url_360}
          barrio={barrio}
          onClose={() => setShowTour(false)}
        />
      )}
    </>
  );
}