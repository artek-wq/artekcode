import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import type {Origin} from '~/lib/config';
import type {Product, Variant} from '~/lib/catalog/types';
import {useLocale} from '~/lib/i18n';

/* -------------------------------------------------------------------------- */
/* Almacenamiento local seguro                                                */
/* -------------------------------------------------------------------------- */

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado o almacenamiento bloqueado: seguimos en memoria */
  }
}

/* -------------------------------------------------------------------------- */
/* Carrito (sin cuenta). Se envía a Shopify solo al pagar.                    */
/* -------------------------------------------------------------------------- */

export interface CartLine {
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  emoji: string;
  origin: Origin;
  quantity: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, v: Variant, qty?: number) => void;
  update: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);
const CART_KEY = 'oso_cart_v1';

export function CartProvider({children}: {children: React.ReactNode}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setLines(readStore<CartLine[]>(CART_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(CART_KEY, lines);
  }, [lines, ready]);

  // Al cambiar de idioma/moneda, refrescamos precios desde el catálogo.
  const linesRef = useRef(lines);
  linesRef.current = lines;
  useEffect(() => {
    const ids = linesRef.current.map((l) => l.variantId).join(',');
    if (!ready || !ids) return;
    let cancelled = false;
    fetch(`/api/variants?ids=${encodeURIComponent(ids)}`)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, {price: number; compareAtPrice: number | null}>>) : null))
      .then((data) => {
        if (!data || cancelled) return;
        setLines((prev) => prev.map((l) => (data[l.variantId] ? {...l, ...data[l.variantId]} : l)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale, ready]);

  const add = useCallback((p: Product, v: Variant, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === v.id);
      if (existing) {
        return prev.map((l) => (l.variantId === v.id ? {...l, quantity: Math.min(99, l.quantity + qty)} : l));
      }
      return [
        ...prev,
        {
          variantId: v.id,
          handle: p.handle,
          title: p.title,
          variantTitle: p.variants.length > 1 ? v.title : '',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          image: p.images[0]?.url ?? null,
          emoji: p.emoji,
          origin: p.origin,
          quantity: qty,
        },
      ];
    });
    setOpen(true);
  }, []);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
      open,
      setOpen,
      add,
      update: (id, qty) =>
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.variantId !== id) : prev.map((l) => (l.variantId === id ? {...l, quantity: qty} : l)),
        ),
      remove: (id) => setLines((prev) => prev.filter((l) => l.variantId !== id)),
      clear: () => setLines([]),
    }),
    [lines, open, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Favoritos (sin cuenta)                                                     */
/* -------------------------------------------------------------------------- */

interface WishlistCtx {
  handles: string[];
  has: (handle: string) => boolean;
  toggle: (handle: string) => void;
}
const WishlistContext = createContext<WishlistCtx | null>(null);
const WISH_KEY = 'oso_wishlist_v1';

export function WishlistProvider({children}: {children: React.ReactNode}) {
  const [handles, setHandles] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHandles(readStore<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) writeStore(WISH_KEY, handles);
  }, [handles, ready]);

  const value = useMemo<WishlistCtx>(
    () => ({
      handles,
      has: (h) => handles.includes(h),
      toggle: (h) => setHandles((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [h, ...prev])),
    }),
    [handles],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  return ctx;
}
