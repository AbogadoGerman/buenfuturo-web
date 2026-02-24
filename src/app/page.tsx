import PropertyGrid from "@/components/PropertyGrid";

// ─── Testimonios ──────────────────────────────────────────────────────────────
const testimonios = [
  {
    nombre: "Dr. Carlos Mendoza",
    perfil: "Abogado Corporativo",
    texto:
      "La asesoría jurídica que recibí fue impecable. Entendí cada cláusula del contrato y me sentí completamente protegido en la negociación.",
  },
  {
    nombre: "Valentina Ríos",
    perfil: "Inversionista Inmobiliaria",
    texto:
      "He comprado tres propiedades a través de Buen Futuro. El tour 360° me ahorra viajes innecesarios y la rentabilidad ha superado mis expectativas.",
  },
  {
    nombre: "Familia Gutiérrez-Mora",
    perfil: "Compradores de Primera Vivienda",
    texto:
      "Éramos novatos comprando nuestro primer apartamento. Nos guiaron paso a paso, desde el tour virtual hasta la firma de escrituras.",
  },
  {
    nombre: "Dra. Lucía Fernández",
    perfil: "Abogada de Familia",
    texto:
      "Como colega jurídica, valoro enormemente la transparencia en los títulos de propiedad. Aquí todo está en regla desde el primer día.",
  },
  {
    nombre: "Roberto Salamanca",
    perfil: "Inversionista Independiente",
    texto:
      "El catálogo virtual 360° es una ventaja enorme. Pude comparar cinco apartamentos en una tarde sin salir de mi oficina en Medellín.",
  },
  {
    nombre: "Andrés y Patricia Lozano",
    perfil: "Familia en Crecimiento",
    texto:
      "Encontramos el apartamento perfecto en Cedritos para nuestra familia. El acompañamiento post-venta también fue excelente.",
  },
  {
    nombre: "Ing. Mauricio Triana",
    perfil: "Empresario e Inversionista",
    texto:
      "Seriedad, respaldo legal y tecnología de punta. Buen Futuro es sin duda la plataforma más confiable del mercado inmobiliario bogotano."
  },
];

// ─── Constantes ───────────────────────────────────────────────────────────────
const VINOTINTO = "#800020";
const GRIS_CARBON = "#2D2D2D";
const WHATSAPP_NUMBER = "573108074915";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20apartamentos%20disponibles.`;

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-8 rounded-full block"
              style={{ backgroundColor: VINOTINTO }}
            />
            <h1
              className="text-2xl font-bold tracking-wide font-[var(--font-playfair)]"
              style={{ color: VINOTINTO }}
            >
              Buen Futuro
            </h1>
          </div>

          {/* Nav WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-semibold rounded-full shadow-md hover:bg-[#1ebe5d] transition-colors duration-200 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.64 6.04L0 24l6.18-1.62A11.96 11.96 0 0 0 12 24c6.63 0 12-5.37 12-12a11.93 11.93 0 0 0-3.48-8.52zM12 22a9.94 9.94 0 0 1-5.07-1.38l-.36-.21-3.67.96.99-3.58-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H6.8c-.17 0-.45.06-.69.3s-.9.88-.9 2.14.92 2.49 1.05 2.66c.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.27-.17-.57-.3z" />
            </svg>
            Contáctanos
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 sm:py-32 px-4"
        style={{ backgroundColor: VINOTINTO }}
      >
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#f5c6c6] mb-4 font-semibold">
            Plataforma Inmobiliaria con Respaldo Jurídico
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white font-[var(--font-playfair)]">
            Tu próximo hogar en Bogotá,
            <br />
            <span className="italic">visto en 360°</span>
          </h2>
          <p className="text-base sm:text-lg text-[#f5e0e3] max-w-xl mx-auto mb-10 leading-relaxed">
            Explora cada rincón de tu futuro apartamento desde cualquier lugar.
            Asesoría jurídica gratuita en cada negociación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#catalogo"
              className="px-8 py-3.5 bg-white font-bold rounded-full shadow-lg hover:bg-[#f5e0e3] transition-colors duration-200 text-base"
              style={{ color: VINOTINTO }}
            >
              Ver Catálogo
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white transition-colors duration-200 text-base"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = VINOTINTO;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
              }}
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CATÁLOGO — PropertyGrid
      ═══════════════════════════════════════════════════════════════════════ */}
      <div id="catalogo" className="scroll-mt-20">
        <PropertyGrid />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIOS — Confianza Buen Futuro
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: GRIS_CARBON }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3 font-semibold">
              Testimonios verificados
            </p>
            <h3 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-playfair)] mb-3">
              Confianza Buen Futuro
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
              Abogados, inversionistas y familias que confiaron en nosotros
              para tomar la mejor decisión inmobiliaria.
            </p>
          </div>

          {/* Grid de testimonios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonios.map((t, i) => (
              <blockquote
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors duration-300"
              >
                {/* Comillas decorativas */}
                <span
                  className="text-3xl leading-none font-serif opacity-40"
                  style={{ color: VINOTINTO }}
                >
                  &ldquo;
                </span>
                <p className="text-gray-300 text-sm leading-relaxed -mt-4">
                  {t.texto}
                </p>
                <footer className="mt-auto flex items-center gap-3 pt-4 border-t border-white/10">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: VINOTINTO }}
                  >
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm leading-tight"
                      style={{ color: "#f5c6c6" }}
                    >
                      {t.nombre}
                    </p>
                    <p className="text-gray-500 text-xs">{t.perfil}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="text-white text-center py-8 px-4"
        style={{ backgroundColor: VINOTINTO }}
      >
        <p className="text-sm font-semibold tracking-wide">
          © {new Date().getFullYear()} Buen Futuro · Bogotá, Colombia
        </p>
        <p className="text-xs text-[#f5c6c6] mt-1">
          Plataforma inmobiliaria con respaldo jurídico
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHATSAPP FLOTANTE
      ═══════════════════════════════════════════════════════════════════════ */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.64 6.04L0 24l6.18-1.62A11.96 11.96 0 0 0 12 24c6.63 0 12-5.37 12-12a11.93 11.93 0 0 0-3.48-8.52zM12 22a9.94 9.94 0 0 1-5.07-1.38l-.36-.21-3.67.96.99-3.58-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H6.8c-.17 0-.45.06-.69.3s-.9.88-.9 2.14.92 2.49 1.05 2.66c.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.27-.17-.57-.3z" />
        </svg>
      </a>
    </main>
  );
}