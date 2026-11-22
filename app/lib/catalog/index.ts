import type {Storefront} from '@shopify/hydrogen';
import {
  ANIMAL_KEYS,
  CATEGORY_KEYS,
  ORIGIN_KEYS,
  STORE,
  isAnimal,
  isCategory,
  isOrigin,
  type Locale,
} from '~/lib/config';
import {ORIGIN_SPEED} from '~/lib/delivery';
import {DEMO_PRODUCTS} from '~/content/demo-products';
import {createShopifyCatalog} from './shopify';
import {
  SORT_KEYS,
  isOnSale,
  minPrice,
  type Catalog,
  type Product,
  type ProductFilters,
  type SortKey,
} from './types';

export * from './types';

/** Sin dominio de tienda real (o con DEMO_CATALOG=true) usamos el catálogo de demostración. */
export function isDemoMode(env: Env) {
  const domain = env.PUBLIC_STORE_DOMAIN ?? '';
  return !domain || domain.includes('mock.shop') || (env as {DEMO_CATALOG?: string}).DEMO_CATALOG === 'true';
}

export type CatalogContext = {env: Env; storefront: Storefront};

export function getCatalog(context: CatalogContext, locale: Locale): Catalog {
  if (!isDemoMode(context.env)) return createShopifyCatalog(context.storefront);

  const convert = (p: Product): Product =>
    locale === 'es'
      ? p
      : {
          ...p,
          variants: p.variants.map((v) => ({
            ...v,
            price: toUsd(v.price),
            compareAtPrice: v.compareAtPrice ? toUsd(v.compareAtPrice) : null,
          })),
        };

  return {
    isDemo: true,
    async getAllProducts() {
      return DEMO_PRODUCTS.map(convert);
    },
    async getProduct(handle) {
      const p = DEMO_PRODUCTS.find((x) => x.handle === handle);
      return p ? convert(p) : null;
    },
  };
}

function toUsd(mxn: number) {
  return Math.round((mxn / STORE.demoUsdRate) * 100) / 100;
}

/* ------------------------------ Filtros (URL) ------------------------------ */

export function parseFilters(url: URL): ProductFilters {
  const sp = url.searchParams;
  const list = (k: string) => sp.getAll(k).flatMap((v) => v.split(',')).filter(Boolean);
  const num = (k: string) => {
    const v = Number(sp.get(k));
    return sp.get(k) && Number.isFinite(v) ? v : undefined;
  };
  const sort = sp.get('orden') as SortKey | null;
  return {
    q: sp.get('q')?.trim() || undefined,
    animal: list('animal').filter(isAnimal),
    category: list('categoria').filter(isCategory),
    origin: list('entrega').filter(isOrigin),
    brand: list('marca'),
    minPrice: num('min'),
    maxPrice: num('max'),
    minRating: num('estrellas'),
    deals: sp.get('ofertas') === '1',
    inStock: sp.get('disponible') === '1',
    sort: sort && SORT_KEYS.includes(sort) ? sort : 'relevance',
  };
}

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Filtrado en memoria: con un catálogo de hasta ~250 productos es instantáneo
 * y nos deja usar la misma lógica en demo y con Shopify.
 */
export function applyFilters(products: Product[], f: ProductFilters, ignore?: keyof ProductFilters) {
  const terms = f.q ? normalize(f.q).split(/\s+/) : [];
  const res = products.filter((p) => {
    if (terms.length) {
      const hay = normalize([p.title, p.brand, p.description, p.category, ...p.animals, ...p.tags].join(' '));
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    if (ignore !== 'animal' && f.animal?.length && !p.animals.some((a) => f.animal!.includes(a))) return false;
    if (ignore !== 'category' && f.category?.length && !f.category.includes(p.category)) return false;
    if (ignore !== 'origin' && f.origin?.length && !f.origin.includes(p.origin)) return false;
    if (ignore !== 'brand' && f.brand?.length && !f.brand.includes(p.brand)) return false;
    const price = minPrice(p);
    if (f.minPrice != null && price < f.minPrice) return false;
    if (f.maxPrice != null && price > f.maxPrice) return false;
    if (f.minRating && (p.rating ?? 0) < f.minRating) return false;
    if (f.deals && !isOnSale(p)) return false;
    if (f.inStock && !p.variants.some((v) => v.available)) return false;
    return true;
  });

  const score = (p: Product) => (p.rating ?? 3) * Math.log(2 + p.reviewCount);
  switch (f.sort) {
    case 'priceAsc':
      return res.sort((a, b) => minPrice(a) - minPrice(b));
    case 'priceDesc':
      return res.sort((a, b) => minPrice(b) - minPrice(a));
    case 'rating':
      return res.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
    case 'fastest':
      return res.sort((a, b) => ORIGIN_SPEED[a.origin] - ORIGIN_SPEED[b.origin] || score(b) - score(a));
    default:
      return res.sort((a, b) => score(b) - score(a));
  }
}

/** Conteos por opción de filtro (para mostrar "Reptiles (12)"). */
export function facetCounts(products: Product[], f: ProductFilters) {
  const count = <K extends string>(keys: readonly K[], ignore: keyof ProductFilters, get: (p: Product) => K[]) => {
    const base = applyFilters(products, f, ignore);
    return Object.fromEntries(keys.map((k) => [k, base.filter((p) => get(p).includes(k)).length])) as Record<K, number>;
  };
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  return {
    animal: count(ANIMAL_KEYS, 'animal', (p) => p.animals),
    category: count(CATEGORY_KEYS, 'category', (p) => [p.category]),
    origin: count(ORIGIN_KEYS, 'origin', (p) => [p.origin]),
    brand: count(brands, 'brand', (p) => [p.brand]),
  };
}
