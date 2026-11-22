# Oso Shop — tienda headless (Shopify Hydrogen)

Tienda en línea de **ososhop.mx**: artículos para reptiles, anfibios, peces, tortugas e invertebrados.
Frontend propio (headless) con **Shopify Hydrogen** (React Router 7 + Tailwind v4), desplegado en **Oxygen** (hosting incluido en Shopify).

## Qué incluye esta primera versión (MVP)

| Área | Detalle |
|---|---|
| Inicio | Hero, leyenda de tiempos de entrega, compra por animal, tarjetas 2×2 estilo Amazon (más limpias), guías, más vendidos, categorías |
| Catálogo | `/collections/all`, `/collections/<animal>`, `/collections/<categoría>` y `/search?q=` con filtros: tiempo de entrega, animal, categoría, precio, calificación, ofertas, disponible, marca; orden por relevancia, precio, calificación o entrega más rápida |
| Etiquetas de origen | 🟢 Entrega 1–3 días (nacional) · 🔵 2–5 días (dropshipping cercano) · 🟠 10–20 días (importación). El cliente solo ve el tiempo, nunca el país |
| Producto | Variantes (máx. 3), fecha estimada de llegada, carrito / comprar ahora, favoritos, guías relacionadas, productos relacionados, espacio para reseñas (Judge.me) |
| Carrito | Sin cuenta, se agrupa por envío y avisa cuando llegará en varios paquetes; barra de envío gratis; el pago lo procesa Shopify |
| Favoritos | Sin cuenta (`/favoritos`), guardados en el navegador |
| Asesoría | `/guias`: guías en **diapositivas visuales dentro de un diálogo** (desliza con el dedo o las flechas), artículo completo, sugerencias discretas de productos y "kit recomendado" |
| Herramientas | `/herramientas/acuario`: litros, peso, filtro y calentador recomendados |
| Idiomas | Español/MXN y English/USD (`/idioma?lang=en`) |
| Cuentas | Inicio de sesión con Customer Accounts de Shopify (`/account`) para programas de descuento |

## Modo demo vs. tienda real

Sin credenciales de Shopify la tienda corre en **modo demo** con 30 productos y 7 guías (`app/content/`).
Al conectar la tienda (ver [docs/01-configurar-shopify.md](docs/01-configurar-shopify.md)) los productos se leen de Shopify automáticamente.

## Desarrollo

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Abre http://localhost:3000.

## Estructura

```
app/
  lib/config.ts           ← orígenes, tiempos, animales, categorías, envío gratis (EDITAR AQUÍ)
  lib/i18n.ts             ← textos en español e inglés
  lib/catalog/            ← catálogo: demo o Shopify (metafields) + filtros
  content/guides.ts       ← guías de asesoría (diapositivas + artículo + kit)
  content/demo-products.ts← catálogo de demostración
  components/             ← Layout, producto, carrito, filtros, guías
  routes/                 ← páginas
  styles/tailwind.css     ← paleta de colores (tokens)
docs/                     ← guías de configuración y pendientes
```

## Documentación

1. [Configurar la tienda en Shopify](docs/01-configurar-shopify.md)
2. [Orígenes y apps de dropshipping](docs/02-dropshipping-y-origenes.md)
3. [Pendientes y siguientes fases](docs/03-pendientes.md)
