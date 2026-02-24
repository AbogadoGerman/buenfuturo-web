#!/usr/bin/env node
// =============================================================================
// scripts/update-properties.js
// Pre-procesador de inventario inmobiliario para Buen Futuro
//
// Flujo:
//   1. Descarga el CSV de Google Drive (via axios)
//   2. Parsea el CSV con papaparse
//   3. Por cada inmueble, visita la URL de la columna `url`
//   4. Con cheerio extrae URLs de imágenes (<img>, og:image, JSON-LD, etc.)
//   5. Escribe src/data/inventory.json con toda la info + fotos
//
// Uso:
//   node scripts/update-properties.js
//   node scripts/update-properties.js --dry-run   (no escribe el JSON)
//
// Variables de entorno (opcional, o editar GOOGLE_DRIVE_CSV_ID abajo):
//   GOOGLE_DRIVE_CSV_ID=<tu_file_id>
// =============================================================================

import axios from "axios";
import * as Papa from "papaparse";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Helpers de rutas ESM ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// ── Configuración ──────────────────────────────────────────────────────────
const CONFIG = {
  /** ID del archivo en Google Drive (la parte de la URL después de /d/) */
  googleDriveFileId: process.env.GOOGLE_DRIVE_CSV_ID ?? "REEMPLAZA_CON_TU_FILE_ID",

  /** Ruta de salida del JSON generado */
  outputPath: path.join(ROOT, "src", "data", "inventory.json"),

  /** Imagen placeholder cuando no se encuentran fotos */
  placeholderImage: "/images/placeholder-property.svg",

  /** Timeout por request (ms) */
  requestTimeoutMs: 15_000,

  /** Pausa entre requests para no saturar los servidores (ms) */
  delayBetweenRequestsMs: 800,

  /** Máximo de imágenes a guardar por inmueble */
  maxImagesPerProperty: 12,

  /** User-Agent para los requests de scraping */
  userAgent:
    "Mozilla/5.0 (compatible; BuenFuturoBot/1.0; +https://buenfuturo.com.co)",
};

// ── Colores ANSI para la consola ────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const log = {
  info: (msg) => console.log(`${c.cyan}ℹ${c.reset}  ${msg}`),
  success: (msg) => console.log(`${c.green}✔${c.reset}  ${msg}`),
  warn: (msg) => console.log(`${c.yellow}⚠${c.reset}  ${msg}`),
  error: (msg) => console.error(`${c.red}✖${c.reset}  ${msg}`),
  title: (msg) =>
    console.log(`\n${c.bold}${c.cyan}${"─".repeat(60)}${c.reset}\n${c.bold}  ${msg}${c.reset}\n${"─".repeat(60)}`),
};

// ── Utilidades ──────────────────────────────────────────────────────────────

/** Espera N milisegundos */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Construye la URL de descarga directa de Google Drive */
function buildGoogleDriveUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/** Devuelve true si la URL parece ser una imagen válida */
function isImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    const ext = parsed.pathname.split(".").pop()?.toLowerCase();
    const validExts = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];
    // Acepta extensiones conocidas O URLs de CDNs inmobiliarios comunes
    return (
      validExts.includes(ext) ||
      /\/(photos?|images?|fotos?|gallery|galeria)\//i.test(parsed.pathname) ||
      /(cloudinary|imgix|imagekit|cdn\.|photos\.)/i.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

/** Convierte una URL relativa en absoluta usando la URL base */
function toAbsolute(href, baseUrl) {
  if (!href) return null;
  href = href.trim();
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("http")) return href;
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return null;
  }
}

/** Deduplica y limita un array de URLs */
function dedupeUrls(urls, max) {
  return [...new Set(urls.filter(Boolean))].slice(0, max);
}

// ── Descarga del CSV ────────────────────────────────────────────────────────

async function downloadCsv(fileId) {
  const url = buildGoogleDriveUrl(fileId);
  log.info(`Descargando CSV desde Google Drive…`);
  log.info(`  URL: ${c.gray}${url}${c.reset}`);

  const response = await axios.get(url, {
    timeout: CONFIG.requestTimeoutMs,
    headers: { "User-Agent": CONFIG.userAgent },
    // Sigue redirecciones (necesario para Google Drive)
    maxRedirects: 5,
    responseType: "text",
  });

  if (typeof response.data !== "string" || response.data.trim() === "") {
    throw new Error(
      "La respuesta de Google Drive no contiene texto CSV. " +
        "Verifica que el archivo sea público ('Cualquier persona con el enlace')."
    );
  }

  log.success(`CSV descargado (${(response.data.length / 1024).toFixed(1)} KB)`);
  return response.data;
}

// ── Parseo del CSV ──────────────────────────────────────────────────────────

function parseCsv(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_") ,
    transform: (v) => v.trim(),
  });

  if (result.errors.length > 0) {
    result.errors.forEach((e) =>
      log.warn(`CSV parse warning (fila ${e.row}): ${e.message}`)
    );
  }

  log.success(`CSV parseado: ${result.data.length} inmuebles encontrados`);

  // Validación mínima
  const sample = result.data[0] ?? {};
  if (!("url" in sample)) {
    log.warn(
      "No se encontró la columna 'url' en el CSV. " +
        "El scraping de imágenes no funcionará. " +
        "Columnas disponibles: " + Object.keys(sample).join(", ")
    );
  }

  return result.data;
}

// ── Scraping de imágenes ────────────────────────────────────────────────────

/**
 * Estrategias de extracción (de más confiable a menos):
 *   1. og:image / twitter:image (meta tags)
 *   2. JSON-LD (schema.org ImageObject)
 *   3. <img> con src o data-src/data-lazy-src
 *   4. srcset
 *   5. Atributos data-* comunes en portales inmobiliarios colombianos
 */
function extractImages($, baseUrl) {
  const images = [];

  // 1. Open Graph / Twitter Card
  const ogImage = $('meta[property="og:image"]').attr("content");
  const twitterImage = $('meta[name="twitter:image"]').attr("content");
  if (ogImage) images.push(toAbsolute(ogImage, baseUrl));
  if (twitterImage) images.push(toAbsolute(twitterImage, baseUrl));

  // 2. JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? "{}");
      const items = Array.isArray(data) ? data : [data];
      items.forEach((item) => {
        // schema.org/RealEstateListing, schema.org/Apartment, etc.
        const photos = item.photo ?? item.image ?? [];
        const photoArr = Array.isArray(photos) ? photos : [photos];
        photoArr.forEach((p) => {
          const src = typeof p === "string" ? p : p?.url ?? p?.contentUrl;
          if (src) images.push(toAbsolute(src, baseUrl));
        });
      });
    } catch {
      // JSON malformado — ignorar
    }
  });

  // 3. <img> estándar y lazy-load
  $("img").each((_, el) => {
    const attrs = ["src", "data-src", "data-lazy-src", "data-original", "data-image"];
    for (const attr of attrs) {
      const val = $(el).attr(attr);
      if (val && !val.startsWith("data:")) {
        images.push(toAbsolute(val, baseUrl));
        break;
      }
    }
    // srcset
    const srcset = $(el).attr("srcset") ?? $(el).attr("data-srcset");
    if (srcset) {
      srcset.split(",").forEach((part) => {
        const url = part.trim().split(/\s+/)[0];
        if (url) images.push(toAbsolute(url, baseUrl));
      });
    }
  });

  // 4. Atributos data-* con URLs (galerías SPA / portales como Metrocuadrado, Fincaraiz)
  $(["data-photo-url", "data-image-url", "data-src-large", "data-full"]).each(
    (_, el) => {
      const attrs = ["data-photo-url", "data-image-url", "data-src-large", "data-full"];
      attrs.forEach((attr) => {
        const val = $(el).attr(attr);
        if (val) images.push(toAbsolute(val, baseUrl));
      });
    }
  );

  // 5. Filtrar solo URLs que parecen imágenes y deduplicar
  return dedupeUrls(
    images.filter(isImageUrl),
    CONFIG.maxImagesPerProperty
  );
}

async function scrapeImages(url) {
  const headers = {
    "User-Agent": CONFIG.userAgent,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-CO,es;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
  };

  const response = await axios.get(url, {
    timeout: CONFIG.requestTimeoutMs,
    headers,
    maxRedirects: 5,
  });

  const $ = cheerio.load(response.data);
  return extractImages($, url);
}

// ── Procesamiento principal ─────────────────────────────────────────────────

async function processProperties(properties) {
  const results = [];
  const total = properties.length;

  for (let i = 0; i < total; i++) {
    const prop = properties[i];
    const label = prop.nid ?? prop.id ?? prop.codigo ?? `#${i + 1}`;
    const url = prop.url ?? prop.link ?? prop.enlace ?? "";

    process.stdout.write(
      `  [${String(i + 1).padStart(3)}/${total}] ${c.bold}${label}${c.reset} `
    );

    let images = [];
    let scrapeStatus = "ok";

    if (!url) {
      scrapeStatus = "sin_url";
      log.warn(`sin URL — usando placeholder`);
    } else {
      try {
        images = await scrapeImages(url);
        if (images.length > 0) {
          console.log(`${c.green}→ ${images.length} foto(s)${c.reset}`);
        } else {
          scrapeStatus = "sin_fotos";
          console.log(`${c.yellow}→ 0 fotos — usando placeholder${c.reset}`);
        }
      } catch (err) {
        scrapeStatus = "error";
        const msg =
          err.code === "ECONNABORTED"
            ? "timeout"
            : err.response
            ? `HTTP ${err.response.status}`
            : err.message.slice(0, 60);
        console.log(`${c.red}→ error (${msg}) — usando placeholder${c.reset}`);
      }
    }

    // Si no hay imágenes, insertar placeholder
    if (images.length === 0) {
      images = [CONFIG.placeholderImage];
    }

    results.push({
      ...prop,
      images,
      _scrapeStatus: scrapeStatus,
      _scrapedAt: new Date().toISOString(),
    });

    // Pausa entre requests para ser amable con los servidores
    if (i < total - 1 && url && scrapeStatus !== "sin_url") {
      await delay(CONFIG.delayBetweenRequestsMs);
    }
  }

  return results;
}

// ── Escritura del JSON ──────────────────────────────────────────────────────

function writeOutput(data, isDryRun) {
  const outputDir = path.dirname(CONFIG.outputPath);

  if (!isDryRun) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      CONFIG.outputPath,
      JSON.stringify(
        {
          _meta: {
            generatedAt: new Date().toISOString(),
            totalProperties: data.length,
            scriptVersion: "1.0.0",
          },
          properties: data,
        },
        null,
        2
      ),
      "utf-8"
    );
    log.success(`JSON escrito en: ${c.cyan}${CONFIG.outputPath}${c.reset}`);
  } else {
    log.warn("--dry-run activo: el archivo NO fue escrito.");
    console.log("\nMuestra del primer inmueble:");
    console.log(JSON.stringify(data[0], null, 2));
  }
}

// ── Stats finales ───────────────────────────────────────────────────────────

function printStats(data) {
  const withPhotos = data.filter(
    (p) => p.images.length > 0 && p.images[0] !== CONFIG.placeholderImage
  ).length;
  const withPlaceholder = data.length - withPhotos;
  const errors = data.filter((p) => p._scrapeStatus === "error").length;

  log.title("Resumen final");
  console.log(`  Total inmuebles  : ${c.bold}${data.length}${c.reset}`);
  console.log(`  Con fotos reales : ${c.green}${withPhotos}${c.reset}`);
  console.log(`  Con placeholder  : ${c.yellow}${withPlaceholder}${c.reset}`);
  console.log(`  Con errores HTTP : ${c.red}${errors}${c.reset}`);
}

// ── Entry point ─────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  log.title("Buen Futuro · update-properties.js");
  log.info(`Modo: ${isDryRun ? c.yellow + "DRY RUN" + c.reset : c.green + "PRODUCCIÓN" + c.reset}`);

  // 1. Descarga el CSV
  const csvText = await downloadCsv(CONFIG.googleDriveFileId);

  // 2. Parsea el CSV
  const properties = parseCsv(csvText);
  if (properties.length === 0) {
    log.error("El CSV está vacío o no pudo ser parseado. Abortando.");
    process.exit(1);
  }

  // 3. Scraping de imágenes
  log.title(`Scraping de ${properties.length} inmuebles`);
  const enriched = await processProperties(properties);

  // 4. Escribe el JSON
  writeOutput(enriched, isDryRun);

  // 5. Stats
  printStats(enriched);

  log.success("¡Proceso completado!");
}

main().catch((err) => {
  log.error(`Error fatal: ${err.message}`);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});