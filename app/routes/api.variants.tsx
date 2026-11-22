import type {Route} from './+types/api.variants';
import {getCatalog} from '~/lib/catalog';
import {getLocaleFromRequest} from '~/lib/i18n';

/** Precios actuales (moneda activa) de las variantes del carrito. */
export async function loader({request, context}: Route.LoaderArgs) {
  const ids = new Set((new URL(request.url).searchParams.get('ids') ?? '').split(',').filter(Boolean));
  const catalog = getCatalog(context, getLocaleFromRequest(request));
  const products = await catalog.getAllProducts();
  const out: Record<string, {price: number; compareAtPrice: number | null}> = {};
  for (const p of products)
    for (const v of p.variants)
      if (ids.has(v.id)) out[v.id] = {price: v.price, compareAtPrice: v.compareAtPrice};
  return Response.json(out, {headers: {'Cache-Control': 'no-store'}});
}
