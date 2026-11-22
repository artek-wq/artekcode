# 2. Orígenes y apps de dropshipping

## Cómo se clasifica cada producto

| Color | Etiqueta que ve el cliente | `custom.origen` | Proveedor típico |
|---|---|---|---|
| 🟢 Verde | Entrega 1–3 días | `nacional` | Inventario propio o proveedor en México |
| 🔵 Azul | Entrega 2–5 días | `express` | Almacenes en EE. UU. / cercanos |
| 🟠 Ámbar | Entrega 10–20 días | `importacion` | Envío desde China |

Los días (hábiles) se ajustan en `app/lib/config.ts → ORIGINS` y con ellos se calcula la fecha estimada en el producto.

> **Ojo:** el origen depende del **almacén** desde el que sale el producto, no de la app. CJ y Zendrop, por ejemplo, tienen almacenes en China *y* en EE. UU.; asigna `custom.origen` según el almacén que elijas al importar.

## Apps recomendadas

| App | Para qué | Nota |
|---|---|---|
| **Zendrop** | Dropshipping desde EE. UU. y China | Su envío desde EE. UU. encaja con “2–5 días” |
| **CJ Dropshipping** | Catálogo amplio, almacenes en varios países | Elige almacén por producto; buena opción para accesorios de acuario |
| **DSers** | Importar de AliExpress | Para la categoría 🟠 |
| **Syncee** o **Spocket** | Proveedores de EE. UU./Europa | Alternativas para 🔵 |

Antes de lanzar, **pide muestras** de los productos eléctricos (termostatos, calentadores, lámparas UVB): revisa calidad, voltaje (127 V en México) y clavija.

## Flujo para dar de alta un producto

1. Importa el producto con la app.
2. Ajusta título y descripción en español (el cliente nunca ve “China” ni el nombre del proveedor).
3. Llena los metafields: **Origen**, **Animales**, **Categoría**, **Destacados**, **Guías**.
4. Máximo 3 variantes por producto en el lanzamiento.
5. Tradúcelo al inglés con Translate & Adapt.
