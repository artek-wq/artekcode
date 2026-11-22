import type {Storefront} from '@shopify/hydrogen';
import {CATEGORIES, isAnimal, isCategory, isOrigin, type Category} from '~/lib/config';
import type {Catalog, Product} from './types';

/**
 * Adaptador de Shopify (Storefront API).
 *
 * Metafields esperados (ver docs/01-configurar-shopify.md):
 *  - custom.origen   → "nacional" | "express" | "importacion"
 *  - custom.animales → lista de: reptiles, anfibios, peces, tortugas, invertebrados
 *  - custom.categoria→ una de las claves de CATEGORIES (si falta se infiere del Tipo de producto)
 *  - custom.destacados → lista de textos (viñetas)
 *  - custom.guias    → lista de handles de guías relacionadas
 *  - reviews.rating / reviews.rating_count → los escribe la app de reseñas (p. ej. Judge.me)
 */

type Money = {amount: string; currencyCode: string};
type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: {nodes: {url: string; altText: string | null}[]};
  options: {name: string; optionValues: {name: string}[]}[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: Money;
      compareAtPrice: Money | null;
      selectedOptions: {name: string; value: string}[];
    }[];
  };
  origen: {value: string} | null;
  animales: {value: string} | null;
  categoria: {value: string} | null;
  destacados: {value: string} | null;
  guias: {value: string} | null;
  rating: {value: string} | null;
  ratingCount: {value: string} | null;
};

const PRODUCT_FRAGMENT = `#graphql
  fragment OsoProduct on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    images(first: 6) { nodes { url altText } }
    options { name optionValues { name } }
    variants(first: 3) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
    origen: metafield(namespace: "custom", key: "origen") { value }
    animales: metafield(namespace: "custom", key: "animales") { value }
    categoria: metafield(namespace: "custom", key: "categoria") { value }
    destacados: metafield(namespace: "custom", key: "destacados") { value }
    guias: metafield(namespace: "custom", key: "guias") { value }
    rating: metafield(namespace: "reviews", key: "rating") { value }
    ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  query OsoAllProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 250, sortKey: BEST_SELLING) { nodes { ...OsoProduct } }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query OsoProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...OsoProduct }
  }
  ${PRODUCT_FRAGMENT}
` as const;

function jsonList(v: {value: string} | null): string[] {
  if (!v?.value) return [];
  try {
    const parsed = JSON.parse(v.value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return [v.value];
  }
}

function slug(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function inferCategory(raw: RawProduct): Category {
  const explicit = raw.categoria?.value;
  if (isCategory(explicit)) return explicit;
  const type = slug(raw.productType);
  const hit = (Object.keys(CATEGORIES) as Category[]).find(
    (k) => slug(CATEGORIES[k].es).includes(type) || type.includes(k),
  );
  return hit ?? 'decoracion';
}

function rating(raw: RawProduct): number | null {
  if (!raw.rating?.value) return null;
  try {
    // Formato estándar de Shopify: {"scale_min":"1.0","scale_max":"5.0","value":"4.6"}
    return Number((JSON.parse(raw.rating.value) as {value?: string}).value) || null;
  } catch {
    return Number(raw.rating.value) || null;
  }
}

export function mapProduct(raw: RawProduct, rank = 0): Product {
  const origin = isOrigin(raw.origen?.value) ? raw.origen!.value : 'importacion';
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    highlights: jsonList(raw.destacados),
    brand: raw.vendor,
    origin: origin as Product['origin'],
    animals: jsonList(raw.animales).map(slug).filter(isAnimal),
    category: inferCategory(raw),
    tags: raw.tags,
    images: raw.images.nodes.map((i) => ({url: i.url, alt: i.altText ?? raw.title})),
    emoji: '📦',
    rating: rating(raw),
    reviewCount: Number(raw.ratingCount?.value ?? 0),
    options: raw.options
      .filter((o) => !(o.name === 'Title' && o.optionValues.length === 1))
      .map((o) => ({name: o.name, values: o.optionValues.map((v) => v.name)})),
    variants: raw.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      price: Number(v.price.amount),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice.amount) : null,
      available: v.availableForSale,
      options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
    })),
    guides: jsonList(raw.guias),
    rank,
  };
}

export function createShopifyCatalog(storefront: Storefront): Catalog {
  return {
    isDemo: false,
    async getAllProducts() {
      const data = (await storefront.query(ALL_PRODUCTS_QUERY, {
        cache: storefront.CacheShort(),
      })) as {products: {nodes: RawProduct[]}};
      return data.products.nodes.map(mapProduct);
    },
    async getProduct(handle) {
      const data = (await storefront.query(PRODUCT_QUERY, {
        variables: {handle},
        cache: storefront.CacheShort(),
      })) as {product: RawProduct | null};
      return data.product ? mapProduct(data.product) : null;
    },
  };
}
