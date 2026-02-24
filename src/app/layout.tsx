import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Buen Futuro | Apartamentos en Bogotá con Tour 360°",
  description:
    "Encuentra tu próximo hogar en Bogotá con recorridos virtuales 360°. Asesoría jurídica gratuita en cada negociación.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
