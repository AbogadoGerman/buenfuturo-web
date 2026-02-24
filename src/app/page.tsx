import type { Metadata } from "next";

// ─── Datos de ejemplo (placeholders de apartamentos) ──────────────────────────
const apartments = [
  {
    nid: "BF-001",
    barrio: "Chapinero Alto",
    precio: "$320.000.000",
    imagen: "/placeholder-apto.jpg",
  },
  {
    nid: "BF-002",
    barrio: "Cedritos",
    precio: "$285.000.000",
    imagen: "/placeholder-apto.jpg",
  },
  {
    nid: "BF-003",
    barrio: "Chico Norte",
    precio: "$450.000.000",
    imagen: "/placeholder-apto.jpg",
  },
];

// ─── Testimonios ───────────────────────────────────────────────────────────────
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
      "Seriedad, respaldo legal y tecnología de punta. Buen Futuro es sin duda la plataforma más confiable del mercado inmobiliario bogotano.",
  },
];

const WHATSAPP_NUMBER = "573108074915";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20apartamentos%20disponibles.`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9F9F9] font-sans">

      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo / Marca */}
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-[#800020] rounded-full block" />
            <h1 className="text-2xl font-bold text-[#800020] tracking-wide">
              Buen Futuro
            </h1>
          </div>

          {/* Botón WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={
              "
              flex items-center gap-2 px-5 py-2.5
              bg-[#25D366] text-white font-semibold
              rounded-full shadow-md
              hover:bg-[#1ebe5d] transition-colors duration-200
              text-sm sm:text-base
            "
            }
          >
            {/* WhatsApp icon (SVG inline) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.64 6.04L0 24l6.18-1.62A11.96 11.96 0 0 0 12 24c6.63 0 12-5.37 12-12a11.93 11.93 0 0 0-3.48-8.52zM12 22a9.94 9.94 0 0 1-5.07-1.38l-.36-.21-3.67.96.99-3.58-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H6.8c-.17 0-.45.06-.69.3s-.9.88-.9 2.14.92 2.49 1.05 2.66c.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.27-.17-.57-.3z" />
            </svg>
            Contáctanos por WhatsApp
          </a>
        </div>
      </header>

      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="bg-[#800020] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-[#f5c6c6] mb-3 font-semibold">
            Plataforma Inmobiliaria con Respaldo Jurídico
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
            Tu próximo hogar en Bogotá,<br />
            <span className="italic">visto en 360°</span>
          </h2>
          <p className="text-base sm:text-lg text-[#f5e0e3] max-w-xl mx-auto mb-8">
            Explora cada rincón de tu futuro apartamento desde cualquier lugar.
            Asesoría jurídica gratuita en cada negociación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#catalogo"
              className="
                px-8 py-3 bg-white text-[#800020] font-bold rounded-full
                shadow-lg hover:bg-[#f5e0e3] transition-colors duration-200
                text-base
              "
            >
              Ver catálogo
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-8 py-3 border-2 border-white text-white font-semibold rounded-full
                hover:bg-white hover:text-[#800020] transition-colors duration-200
                text-base
              "
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* ─── CATÁLOGO DE APARTAMENTOS ─────────────────────────────── */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#800020] mb-2">
            Apartamentos disponibles
          </h3>
          <p className="text-[#333333] text-sm sm:text-base max-w-xl mx-auto">
            Cada inmueble incluye tour virtual 360° y revisión jurídica incluida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <article
              key={apt.nid}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e8e8e8] hover:shadow-lg transition-shadow duration-200"
            >
              {/* Imagen placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-[#800020] to-[#b5003a] flex items-center justify-center">
                <div className="text-center text-white opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 mx-auto mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                  </svg>
                  <span className="text-xs font-medium">Tour 360° disponible</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-[#888] font-semibold uppercase tracking-widest mb-0.5">
                      NID: {apt.nid}
                    </p>
                    <h4 className="text-lg font-bold text-[#333333]">{apt.barrio}</h4>
                  </div>
                  <span className="bg-[#f5e0e3] text-[#800020] text-xs font-bold px-2 py-1 rounded-full">
                    Disponible
                  </span>
                </div>

                <p className="text-2xl font-bold text-[#800020] mb-4">{apt.precio}</p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "
                    block text-center w-full py-2.5 px-4
                    bg-[#800020] text-white font-semibold rounded-xl
                    hover:bg-[#660018] transition-colors duration-200
                    text-sm
                  "
                  }
                >
                  🔴 Ver Tour 360°
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIOS ─────────────────────────────────────────── */}
      <section className="bg-[#333333] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Lo que dicen nuestros clientes
            </h3>
            <p className="text-[#aaaaaa] text-sm sm:text-base">
              Abogados, inversionistas y familias que confiaron en Buen Futuro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonios.map((t, i) => (
              <blockquote
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4"
              >
                <p className="text-[#444] text-sm leading-relaxed italic">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <footer className="mt-auto flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-[#800020] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#800020] text-sm leading-tight">{t.nombre}</p>
                    <p className="text-[#888] text-xs">{t.perfil}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#800020] text-white text-center py-6 px-4">
        <p className="text-sm font-semibold tracking-wide">
          © {new Date().getFullYear()} Buen Futuro · Bogotá, Colombia
        </p>
        <p className="text-xs text-[#f5c6c6] mt-1">
          Plataforma inmobiliaria con respaldo jurídico
        </p>
      </footer>

    </main>
  );
}