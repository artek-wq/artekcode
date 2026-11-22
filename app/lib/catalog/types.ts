import type {Animal, Category, Origin} from '~/lib/config';

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Variant {
  id: string;
  title: string;
  /** Precio en la moneda activa (MXN o USD). */
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  options: Record<string, string>;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Viñetas cortas tipo "acerca de este artículo". */
  highlights: string[];
  brand: string;
  origin: Origin;
  animals: Animal[];
  category: Category;
  tags: string[];
  images: ProductImage[];
  /** Ícono de respaldo mientras no haya foto. */
  emoji: string;
  rating: number | null;
  reviewCount: number;
  options: {name: string; values: string[]}[];
  variants: Variant[];
  /** Guías relacionadas (handles). */
  guides: string[];
  /** Orden de relevancia / más vendidos. */
  rank: number;
}

export interface ProductFilters {
  q?: string;
  animal?: Animal[];
  category?: Category[];
  origin?: Origin[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  deals?: boolean;
  inStock?: boolean;
  sort?: SortKey;
}

export type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'rating' | 'fastest';
export const SORT_KEYS: SortKey[] = ['relevance', 'priceAsc', 'priceDesc', 'rating', 'fastest'];

export interface Catalog {
  isDemo: boolean;
  getAllProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
}

export function minPrice(p: Product) {
  return Math.min(...p.variants.map((v) => v.price));
}
export function isOnSale(p: Product) {
  return p.variants.some((v) => v.compareAtPrice && v.compareAtPrice > v.price);
}
