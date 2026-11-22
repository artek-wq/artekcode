/**
 * Configuración central de Oso Shop.
 * Todo lo que el negocio puede querer ajustar sin tocar componentes vive aquí.
 */

export type Locale = 'es' | 'en';
export type Currency = 'MXN' | 'USD';

export const STORE = {
  name: 'Oso Shop',
  domain: 'ososhop.mx',
  /** Monto (en MXN) a partir del cual el envío es gratis. Ajusta también la tarifa en Shopify. */
  freeShippingThresholdMXN: 999,
  /** Solo para el modo demo: conversión aproximada MXN → USD. En producción la hace Shopify Markets. */
  demoUsdRate: 18.5,
  supportEmail: 'hola@ososhop.mx',
} as const;

export const LOCALES: Record<
  Locale,
  {label: string; currency: Currency; country: 'MX' | 'US'; language: 'ES' | 'EN'; intl: string}
> = {
  es: {label: 'Español · MXN', currency: 'MXN', country: 'MX', language: 'ES', intl: 'es-MX'},
  en: {label: 'English · USD', currency: 'USD', country: 'US', language: 'EN', intl: 'en-US'},
};

/* -------------------------------------------------------------------------- */
/* Orígenes / tiempos de entrega                                              */
/* -------------------------------------------------------------------------- */

/**
 * Cada producto tiene un origen (metafield `custom.origen` en Shopify).
 * Al cliente solo se le muestra el tiempo de entrega, nunca el país.
 * Los días son hábiles y se usan para calcular la fecha estimada.
 */
export const ORIGINS = {
  nacional: {minDays: 1, maxDays: 3, tone: 'green'},
  express: {minDays: 2, maxDays: 5, tone: 'blue'},
  importacion: {minDays: 10, maxDays: 20, tone: 'amber'},
} as const;

export type Origin = keyof typeof ORIGINS;
export const ORIGIN_KEYS = Object.keys(ORIGINS) as Origin[];

export function isOrigin(value: unknown): value is Origin {
  return typeof value === 'string' && value in ORIGINS;
}

/* -------------------------------------------------------------------------- */
/* Taxonomía: animal → categoría                                              */
/* -------------------------------------------------------------------------- */

export const ANIMALS = {
  reptiles: {emoji: '🦎', es: 'Reptiles', en: 'Reptiles'},
  anfibios: {emoji: '🐸', es: 'Anfibios', en: 'Amphibians'},
  peces: {emoji: '🐠', es: 'Peces y acuarios', en: 'Fish & aquariums'},
  tortugas: {emoji: '🐢', es: 'Tortugas', en: 'Turtles'},
  invertebrados: {emoji: '🦀', es: 'Invertebrados', en: 'Invertebrates'},
} as const;
export type Animal = keyof typeof ANIMALS;
export const ANIMAL_KEYS = Object.keys(ANIMALS) as Animal[];

export const CATEGORIES = {
  habitats: {emoji: '🏠', es: 'Terrarios y acuarios', en: 'Terrariums & tanks'},
  iluminacion: {emoji: '💡', es: 'Iluminación y UVB', en: 'Lighting & UVB'},
  calefaccion: {emoji: '🔥', es: 'Calefacción', en: 'Heating'},
  sustratos: {emoji: '🪨', es: 'Sustratos', en: 'Substrates'},
  alimento: {emoji: '🥬', es: 'Alimento y suplementos', en: 'Food & supplements'},
  decoracion: {emoji: '🌿', es: 'Decoración y refugios', en: 'Decor & hides'},
  filtracion: {emoji: '💧', es: 'Filtración y agua', en: 'Filtration & water'},
  medicion: {emoji: '🌡️', es: 'Medición y control', en: 'Monitoring & control'},
} as const;
export type Category = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

export function isAnimal(v: unknown): v is Animal {
  return typeof v === 'string' && v in ANIMALS;
}
export function isCategory(v: unknown): v is Category {
  return typeof v === 'string' && v in CATEGORIES;
}
