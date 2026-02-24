# Guía de configuración — `update-properties.js`

## 1. Instalar dependencias

```bash
npm install axios papaparse cheerio
```

> Las dependencias son de **runtime de script** (no de la app Next.js). Puedes
> instalarlas como `devDependencies` si el script solo corre localmente:
> 
> ```bash
> npm install -D axios papaparse cheerio
> ```

---

## 2. Configurar el CSV de Google Drive

### 2.1 Hacer el archivo público

1. Abre tu archivo CSV en Google Drive.
2. Clic en **Compartir** → **Cambiar a cualquier persona con el enlace**.
3. Asegúrate de que el permiso sea **Lector**.

### 2.2 Obtener el File ID

La URL de tu archivo tiene esta forma:

```
https://drive.google.com/file/d/ESTE_ES_EL_FILE_ID/view
```

Copia el `FILE_ID`.

### 2.3 Configurar el script

**Opción A – Variable de entorno (recomendada):**

```bash
# .env.local  (no lo subas a git, ya está en .gitignore)
GOOGLE_DRIVE_CSV_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

**Opción B – Editar el script directamente:**

```js
// scripts/update-properties.js, línea ~30
googleDriveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
```

---

## 3. Estructura esperada del CSV

El script es flexible, pero se espera al menos estas columnas:

| Columna | Descripción | Requerida |
|---------|-------------|-----------|
| `nid` o `id` o `codigo` | Identificador único | Recomendada |
| `url` o `link` o `enlace` | URL del portal inmobiliario | **Sí** (para fotos) |
| `barrio` | Barrio o zona | Opcional |
| `precio` | Precio del inmueble | Opcional |
| `area` | Área en m² | Opcional |
| `habitaciones` | Número de habitaciones | Opcional |
| *(cualquier columna extra)* | Se pasa tal cual al JSON | — |

> Los nombres de columna son **case-insensitive** y se normalizan a `snake_case`.

---

## 4. Correr el script

```bash
# Ejecución normal (escribe src/data/inventory.json)
node scripts/update-properties.js

# Dry-run (muestra resultado pero NO escribe el archivo)
node scripts/update-properties.js --dry-run

# Con debug de errores
DEBUG=1 node scripts/update-properties.js
```

### Agregar como npm script en `package.json`

```json
{
  "scripts": {
    "update-inventory": "node scripts/update-properties.js",
    "update-inventory:dry": "node scripts/update-properties.js --dry-run"
  }
}
```

---

## 5. Archivo de salida — `src/data/inventory.json`

```json
{
  "_meta": {
    "generatedAt": "2026-02-24T17:00:00.000Z",
    "totalProperties": 25,
    "scriptVersion": "1.0.0"
  },
  "properties": [
    {
      "nid": "BF-001",
      "barrio": "Chapinero Alto",
      "precio": "$320.000.000",
      "url": "https://www.metrocuadrado.com/inmueble/...",
      "images": [
        "https://cdn.metrocuadrado.com/fotos/foto1.jpg",
        "https://cdn.metrocuadrado.com/fotos/foto2.jpg"
      ],
      "_scrapeStatus": "ok",
      "_scrapedAt": "2026-02-24T17:00:00.000Z"
    },
    {
      "nid": "BF-002",
      "url": "https://portal-caido.com/...",
      "images": ["/images/placeholder-property.svg"],
      "_scrapeStatus": "error",
      "_scrapedAt": "2026-02-24T17:00:00.000Z"
    }
  ]
}
```

### Valores de `_scrapeStatus`

| Valor | Significado |
|-------|-------------|
| `ok` | Fotos encontradas correctamente |
| `sin_fotos` | La página cargó pero no se detectaron imágenes |
| `sin_url` | La fila del CSV no tenía columna `url` |
| `error` | Error HTTP, timeout o falla de red |

---

## 6. Portales inmobiliarios colombianos soportados

El scraper detecta imágenes de:

- **Metrocuadrado** (`metrocuadrado.com`)
- **Finca Raíz** (`fincaraiz.com.co`)
- **OLX** (`olx.com.co`)
- **Properati** (`properati.com.co`)
- Cualquier portal con `og:image`, `twitter:image` o JSON-LD

---

## 7. Automatización con GitHub Actions (opcional)

Crea `.github/workflows/update-inventory.yml` para correr el script automáticamente:

```yaml
name: Update Property Inventory

on:
  schedule:
    - cron: "0 7 * * 1"  # Cada lunes a las 7 AM UTC
  workflow_dispatch:       # También manual desde GitHub

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: node scripts/update-properties.js
        env:
          GOOGLE_DRIVE_CSV_ID: ${{ secrets.GOOGLE_DRIVE_CSV_ID }}
      - name: Commit inventory changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/inventory.json
          git diff --staged --quiet || git commit -m "chore(data): update property inventory [skip ci]"
          git push
```

> Agrega `GOOGLE_DRIVE_CSV_ID` como **Repository Secret** en
> Settings → Secrets → Actions.