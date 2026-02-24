# scripts/update-properties.js

Script de pre-procesamiento del inventario inmobiliario de **Buen Futuro**.

## Qué hace

1. Descarga el CSV maestro desde Google Drive (sin credenciales, archivo público)
2. Parsea cada fila con **papaparse**
3. Por cada inmueble, visita la `url` del portal (Metrocuadrado, Fincaraíz, etc.)
4. Usa **cheerio** para extraer URLs de imágenes con 5 estrategias:
   - `og:image` / `twitter:image` meta tags
   - JSON-LD (`schema.org` `ImageObject`)
   - `<img src>` y variantes lazy-load (`data-src`, `data-lazy-src`, etc.)
   - `srcset`
   - Atributos `data-*` comunes en portales colombianos
5. Genera `src/data/inventory.json` con toda la info del CSV + campo `images[]`
6. Si no hay fotos → usa `/images/placeholder-property.svg`

## Instalación de dependencias

```bash
npm install axios papaparse cheerio
```

## Configuración del CSV en Google Drive

1. Abre tu hoja de cálculo en Google Sheets
2. **Archivo → Descargar → CSV** para verificar el formato
3. **Compartir → Cualquier persona con el enlace → Lector**
4. Copia el **File ID** de la URL:
   `https://drive.google.com/file/d/`**`ESTE_ES_EL_FILE_ID`**`/view`
5. Agrégalo al script o como variable de entorno:

```bash
# .env.local (ya ignorado por .gitignore de Next.js)
GOOGLE_DRIVE_CSV_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

## Estructura del CSV esperada

| Columna | Obligatoria | Descripción |
|---------|-------------|-------------|
| `url` | ✅ | URL del portal (Metrocuadrado, Fincaraíz, etc.) |
| `nid` / `id` / `codigo` | ✅ | Identificador único |
| `barrio` | ✅ | Barrio del inmueble |
| `precio` | ✅ | Precio de venta |
| `area` | Recomendada | Área en m² |
| `habitaciones` | Recomendada | Número de habitaciones |
| *cualquier otra* | Opcional | Pasa directo al JSON |

## Uso

```bash
# Producción — escribe src/data/inventory.json
node scripts/update-properties.js

# Dry-run — muestra el primer inmueble en consola, NO escribe el JSON
node scripts/update-properties.js --dry-run

# Con debug ampliado
DEBUG=1 node scripts/update-properties.js
```

## Agregar a package.json

```json
{
  "scripts": {
    "update-inventory": "node scripts/update-properties.js"
  }
}
```

```bash
npm run update-inventory
```

## Campo `_scrapeStatus` en el JSON

| Valor | Significado |
|-------|-------------|
| `ok` | Fotos encontradas exitosamente |
| `sin_fotos` | La página cargó pero no se encontraron imágenes |
| `sin_url` | La fila no tenía columna `url` |
| `error` | Error HTTP / timeout al visitar la URL |

## Automatización semanal con GitHub Actions

Crea `.github/workflows/update-inventory.yml`:

```yaml
name: Update Property Inventory

on:
  schedule:
    - cron: "0 6 * * 1"   # Todos los lunes a las 6am UTC
  workflow_dispatch:        # También ejecutable manualmente

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run update-inventory
        env:
          GOOGLE_DRIVE_CSV_ID: ${{ secrets.GOOGLE_DRIVE_CSV_ID }}
      - name: Commit inventory update
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/inventory.json
          git diff --staged --quiet || git commit -m "chore(data): update property inventory [skip ci]"
          git push
```

> **Nota:** Agrega `GOOGLE_DRIVE_CSV_ID` en **Settings → Secrets and variables → Actions → New repository secret**.

## Portales colombianos compatibles

| Portal | og:image | JSON-LD | img scraping |
|--------|----------|---------|--------------|
| Metrocuadrado | ✅ | ✅ | ✅ |
| Fincaraíz | ✅ | Parcial | ✅ |
| Lamudi | ✅ | ✅ | ✅ |
| Properati | ✅ | ✅ | ✅ |
| Wasi | ✅ | — | ✅ |