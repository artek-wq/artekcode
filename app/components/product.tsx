import {Link} from 'react-router';
import {useEffect, useState} from 'react';
import {ANIMALS, ORIGINS, type Origin} from '~/lib/config';
import {deliveryWindow, formatDeliveryDate} from '~/lib/delivery';
import {freeShippingThreshold, useLocale, useMoney, useT} from '~/lib/i18n';
import {isOnSale, minPrice, type Product} from '~/lib/catalog/types';
import {useWishlist} from './providers';
import {IconClock, IconHeart, IconTruck} from './icons';

export function imgUrl(url: string, width: number) {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
}

/* ------------------------------ Etiqueta de origen ------------------------------ */

const ORIGIN_CLASSES: Record<Origin, string> = {
  nacional: 'bg-o-nacional-bg text-o-nacional border-o-nacional/25',
  express: 'bg-o-express-bg text-o-express border-o-express/25',
  importacion: 'bg-o-importacion-bg text-o-importacion border-o-importacion/25',
};
const ORIGIN_TEXT: Record<Origin, string> = {
  nacional: 'text-o-nacional',
  express: 'text-o-express',
  importacion: 'text-o-importacion',
};
export const ORIGIN_DOT: Record<Origin, string> = {
  nacional: 'bg-o-nacional',
  express: 'bg-o-express',
  importacion: 'bg-o-importacion',
};

export function OriginBadge({origin, size = 'sm'}: {origin: Origin; size?: 'sm' | 'md'}) {
  const t = useT();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap ${ORIGIN_CLASSES[origin]} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm'
      }`}
    >
      <IconClock className={size === 'sm' ? 'size-3' : 'size-4'} />
      {t(`origin.${origin}`)}
    </span>
  );
}

/** Fecha estimada. Se calcula en el cliente para usar la fecha real del visitante. */
export function DeliveryEstimate({origin, className = ''}: {origin: Origin; className?: string}) {
  const locale = useLocale();
  const t = useT();
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const {from, to} = deliveryWindow(origin);
    setText(t('delivery.arrives', {from: formatDeliveryDate(from, locale), to: formatDeliveryDate(to, locale)}));
  }, [origin, locale]); // eslint-disable-line react-hooks/exhaustive-deps
  const {minDays, maxDays} = ORIGINS[origin];
  return (
    <p className={`flex items-center gap-1.5 text-sm ${className}`}>
      <IconTruck className={`size-4 shrink-0 ${ORIGIN_TEXT[origin]}`} />
      <span>
        {text ?? `${minDays}–${maxDays} ${t('delivery.business')}`}
      </span>
    </p>
  );
}

/* ------------------------------------ Precio ------------------------------------ */

export function Price({amount, compareAt, size = 'md'}: {amount: number; compareAt?: number | null; size?: 'sm' | 'md' | 'lg'}) {
  const money = useMoney();
  const t = useT();
  const sale = compareAt && compareAt > amount;
  const pct = sale ? Math.round((1 - amount / compareAt!) * 100) : 0;
  const cls = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl';
  return (
    <div className="flex flex-col">
      {sale ? (
        <span className="text-xs text-muted">
          <s>{money(compareAt!)}</s>
        </span>
      ) : null}
      <span className="flex items-baseline gap-2">
        <span className={`${cls} font-semibold tracking-tight`}>{money(amount)}</span>
        {sale ? <span className="text-sm font-semibold text-o-nacional">{pct}% OFF</span> : null}
      </span>
      {sale && size === 'lg' ? (
        <span className="text-sm text-muted">
          {t('product.save')} {money(compareAt! - amount)}
        </span>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Estrellas ---------------------------------- */

export function Stars({rating, count, showCount = true}: {rating: number | null; count: number; showCount?: boolean}) {
  const t = useT();
  if (!rating) return <span className="text-xs text-muted">{t('product.noReviews')}</span>;
  const pct = (rating / 5) * 100;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted" aria-label={`${rating} / 5`}>
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      <span className="relative inline-block leading-none text-line" aria-hidden>
        ★★★★★
        <span className="absolute inset-0 overflow-hidden text-star" style={{width: `${pct}%`}}>
          ★★★★★
        </span>
      </span>
      {showCount ? <span>({count})</span> : null}
    </span>
  );
}

/* ----------------------------------- Imagen ----------------------------------- */

const TINTS = ['bg-tint-sand', 'bg-tint-leaf', 'bg-tint-water', 'bg-tint-sun'];

export function ProductThumb({product, className = '', large = false}: {product: Pick<Product, 'images' | 'emoji' | 'title' | 'handle'>; className?: string; large?: boolean}) {
  const img = product.images[0];
  if (img) {
    return <img src={imgUrl(img.url, large ? 900 : 400)} alt={img.alt} loading="lazy" className={`aspect-square w-full object-contain ${className}`} />;
  }
  const tint = TINTS[product.handle.length % TINTS.length];
  return (
    <div className={`grid aspect-square w-full place-items-center ${tint} ${className}`} role="img" aria-label={product.title}>
      <span className={large ? 'text-[9rem]' : 'text-6xl'}>{product.emoji}</span>
    </div>
  );
}

/* ------------------------------- Botón favoritos ------------------------------- */

export function WishlistButton({handle, className = ''}: {handle: string; className?: string}) {
  const {has, toggle} = useWishlist();
  const t = useT();
  const active = has(handle);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(handle);
      }}
      aria-pressed={active}
      aria-label={active ? t('wishlist.remove') : t('wishlist.add')}
      title={active ? t('wishlist.remove') : t('wishlist.add')}
      className={`grid size-9 place-items-center rounded-full bg-surface/90 shadow-sm ring-1 ring-line transition hover:scale-105 ${active ? 'text-deal' : 'text-muted'} ${className}`}
    >
      <IconHeart className="size-5" filled={active} />
    </button>
  );
}

/* ------------------------------- Tarjeta producto ------------------------------- */

export function ProductCard({product, compact = false}: {product: Product; compact?: boolean}) {
  const v = product.variants.reduce((a, b) => (b.price < a.price ? b : a));
  const t = useT();
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:shadow-md ${compact ? 'w-44 shrink-0 md:w-52' : ''}`}
    >
      <div className="relative">
        <ProductThumb product={product} className="transition group-hover:scale-[1.02]" />
        <WishlistButton handle={product.handle} className="absolute top-2 right-2" />
        {isOnSale(product) ? (
          <span className="absolute top-2 left-2 rounded bg-deal px-1.5 py-0.5 text-[11px] font-bold text-white">OFERTA</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <OriginBadge origin={product.origin} />
        <h3 className="line-clamp-2 text-sm leading-snug group-hover:text-link">{product.title}</h3>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-1">
          {product.variants.length > 1 && v.price !== product.variants[0].price ? (
            <span className="text-[11px] text-muted">{t('common.from')}</span>
          ) : null}
          <Price amount={minPrice(product)} compareAt={v.compareAtPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
}

export function AnimalChips({animals}: {animals: Product['animals']}) {
  const locale = useLocale();
  return (
    <div className="flex flex-wrap gap-1.5">
      {animals.map((a) => (
        <Link key={a} to={`/collections/${a}`} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand hover:underline">
          {ANIMALS[a].emoji} {ANIMALS[a][locale]}
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------ Barra envío gratis ------------------------------ */

export function FreeShippingBar({subtotal}: {subtotal: number}) {
  const locale = useLocale();
  const money = useMoney();
  const t = useT();
  const goal = freeShippingThreshold(locale);
  const pct = Math.min(100, (subtotal / goal) * 100);
  const missing = goal - subtotal;
  return (
    <div className="rounded-lg bg-brand-soft p-3">
      <p className="mb-2 text-sm">
        {missing > 0 ? (
          <>
            {t('ship.missingPre')} <strong>{money(missing)}</strong> {t('ship.missingPost')}
          </>
        ) : (
          <strong className="text-o-nacional">{t('ship.unlocked')}</strong>
        )}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-o-nacional transition-all" style={{width: `${pct}%`}} />
      </div>
    </div>
  );
}
