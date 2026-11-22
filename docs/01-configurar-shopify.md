# 1. Configurar la tienda en Shopify

Guía paso a paso para crear la tienda y conectarla a este frontend. Haz los pasos en orden.

## 1.1 Crear la cuenta

1. Entra a shopify.com/mx y crea la tienda con el nombre **Oso Shop**.
2. Plan: **Basic** es suficiente para empezar. Hydrogen/Oxygen está disponible en los planes de pago (no en *Starter*). Verifica las condiciones vigentes al contratar.
3. **Configuración → Información de la tienda**: moneda base **MXN**, zona horaria de México, correo de contacto.

## 1.2 Instalar el canal Hydrogen

1. Hydrogen **no aparece** en la lista de canales instalados hasta que lo instalas. En **Canales de ventas** haz clic en **Shopify App Store** (arriba a la derecha), busca **Hydrogen** (app oficial de Shopify) e instálala. También puedes abrir directo https://apps.shopify.com/hydrogen con la sesión de tu tienda iniciada.
   - Requiere un **plan de pago** (Basic o superior). En periodo de prueba o en tiendas de desarrollo puede no aparecer o no dejar instalarlo.
   - Tu usuario debe tener permiso de **Apps y canales** (el propietario lo tiene).
2. Crea un *storefront* llamado `oso-shop`.
3. Conecta el repositorio de GitHub `artek-wq/artekcode`. Cada push a la rama principal publica la tienda; cada rama genera una vista previa.
4. En tu equipo, dentro del proyecto:

```bash
npx shopify hydrogen link
```

```bash
npx shopify hydrogen env pull
```

Esto llena `.env` con `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, etc. A partir de ahí la tienda deja el modo demo.

## 1.3 Definiciones de metafields (¡importante!)

**Configuración → Datos personalizados → Productos → Agregar definición**. Marca “Acceso de Storefront API” en cada una.

| Nombre | Namespace y key | Tipo | Valores |
|---|---|---|---|
| Origen | `custom.origen` | Texto de una línea, **con lista de valores** | `nacional`, `express`, `importacion` |
| Animales | `custom.animales` | Lista de texto de una línea, con lista de valores | `reptiles`, `anfibios`, `peces`, `tortugas`, `invertebrados` |
| Categoría | `custom.categoria` | Texto de una línea, con lista de valores | `habitats`, `iluminacion`, `calefaccion`, `sustratos`, `alimento`, `decoracion`, `filtracion`, `medicion` |
| Destacados | `custom.destacados` | Lista de texto de una línea | Viñetas cortas del producto |
| Guías | `custom.guias` | Lista de texto de una línea | Handles de guías, p. ej. `gecko-leopardo` |

> El color de la etiqueta sale de `custom.origen`. Si un producto no lo tiene, se muestra como “10–20 días” por precaución.

## 1.4 Mercados e idiomas

1. **Configuración → Mercados**: México (MXN) como principal y **Estados Unidos (USD)**.
2. **Configuración → Idiomas**: agrega Inglés e instala **Translate & Adapt** (gratuita, de Shopify) para traducir productos.

## 1.5 Envíos

1. **Configuración → Envío y entrega**: crea una tarifa de **envío gratis a partir de $999 MXN** (el mismo número está en `app/lib/config.ts → freeShippingThresholdMXN`; mantenlos iguales).
2. Los productos de dropshipping tendrán su propia **ubicación / perfil de envío** que crea cada app. Revisa que el cliente no pague dos veces el envío si así lo decides (el aviso del carrito dice “No pagas envío extra por esto”; cámbialo en `app/lib/i18n.ts` si tu política es otra).

## 1.6 Pagos

**Configuración → Pagos**: activa Shopify Payments (tarjetas) y revisa los métodos locales disponibles para México (p. ej. Mercado Pago u OXXO a través de proveedores compatibles). La disponibilidad cambia; confírmala en tu panel.

## 1.7 Cuentas de cliente y descuentos

1. **Configuración → Cuentas de cliente**: usa **Cuentas de cliente (nuevas)**. El checkout de invitado debe quedar habilitado (comprar sin cuenta).
2. En el canal Hydrogen, configura la URL de callback de Customer Account API (`https://ososhop.mx/account/authorize`).
3. Programa de lealtad: a evaluar (ver [pendientes](03-pendientes.md)). Mientras, los descuentos para miembros pueden hacerse con **descuentos automáticos para segmentos de clientes**.

## 1.8 Reseñas

Instala **Judge.me** (plan gratuito). Escribe la calificación en los metafields estándar `reviews.rating` y `reviews.rating_count`, que esta tienda ya lee para mostrar estrellas y filtrar por calificación.

## 1.9 Dominio

En el canal Hydrogen → *storefront* → **Dominios**: agrega `ososhop.mx` y `www.ososhop.mx` y sigue las instrucciones DNS en tu proveedor del dominio. Opcional: `checkout.ososhop.mx` para el checkout.

## 1.10 Políticas

**Configuración → Políticas**: envíos, reembolsos, privacidad y términos. Se muestran en `/policies/*` (enlaces del pie de página). La política de devoluciones por origen queda pendiente.
