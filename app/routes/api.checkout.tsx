import type {Route} from './+types/api.checkout';
import {isDemoMode} from '~/lib/catalog';

type Body = {lines?: {merchandiseId: string; quantity: number}[]};

/**
 * Crea el carrito en Shopify con las líneas del carrito local y devuelve la URL de pago.
 * El checkout (pagos, envíos, impuestos, descuentos) lo maneja Shopify.
 */
export async function action({request, context}: Route.ActionArgs) {
  if (isDemoMode(context.env)) return Response.json({demo: true});

  const body = (await request.json().catch(() => ({}))) as Body;
  const lines = (body.lines ?? [])
    .filter((l) => typeof l.merchandiseId === 'string' && l.merchandiseId.startsWith('gid://shopify/ProductVariant/'))
    .map((l) => ({merchandiseId: l.merchandiseId, quantity: Math.max(1, Math.min(99, Math.floor(l.quantity) || 1))}))
    .slice(0, 100);
  if (!lines.length) return Response.json({error: 'empty'}, {status: 400});

  const result = await context.cart.create({lines});
  const checkoutUrl = result.cart?.checkoutUrl;
  if (!checkoutUrl) return Response.json({error: result.errors ?? 'cart'}, {status: 500});
  return Response.json({checkoutUrl});
}
