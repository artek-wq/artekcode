import {Link} from 'react-router';
import {useEffect, useState} from 'react';
import {ORIGIN_KEYS, type Origin} from '~/lib/config';
import {useMoney, useRootData, useT} from '~/lib/i18n';
import {useCart, type CartLine} from './providers';
import {FreeShippingBar, OriginBadge, ORIGIN_DOT, imgUrl} from './product';
import {IconShield, IconX} from './icons';

export function CartDrawer() {
  const {open, setOpen, lines} = useCart();
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('cart.title')}>
      <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label={t('guides.close')} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-lg font-bold">{t('cart.title')}</h2>
          <button type="button" onClick={() => setOpen(false)} className="rounded p-1 hover:bg-page" aria-label={t('guides.close')}>
            <IconX />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <p className="mb-4 text-5xl">🛒</p>
              <p className="mb-4 text-muted">{t('cart.empty')}</p>
              <Link to="/collections/all" onClick={() => setOpen(false)} className="btn-cta">
                {t('cart.continue')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <CartShipments compact />
            </div>
            <CartTotals onNavigate={() => setOpen(false)} />
          </>
        )}
      </aside>
    </div>
  );
}

/** Agrupa las líneas por tiempo de entrega y explica que llegan por separado. */
export function CartShipments({compact = false}: {compact?: boolean}) {
  const {lines} = useCart();
  const t = useT();
  const groups = ORIGIN_KEYS.map((o) => ({origin: o, lines: lines.filter((l) => l.origin === o)})).filter((g) => g.lines.length);

  return (
    <div className="space-y-4">
      {groups.length > 1 ? (
        <div className="rounded-lg border border-o-express/30 bg-o-express-bg/50 p-3 text-sm">
          <p className="font-semibold">📦 {t('cart.splitTitle', {n: groups.length})}</p>
          <p className="mt-1 text-muted">{t('cart.splitBody')}</p>
        </div>
      ) : null}
      {groups.map((g, i) => (
        <section key={g.origin} className="rounded-lg border border-line">
          <header className="flex items-center justify-between gap-2 border-b border-line bg-page/60 px-3 py-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className={`size-2.5 rounded-full ${ORIGIN_DOT[g.origin as Origin]}`} />
              {groups.length > 1 ? t('cart.shipment', {n: i + 1}) : t('cart.title')}
            </span>
            <OriginBadge origin={g.origin} />
          </header>
          <ul className="divide-y divide-line">
            {g.lines.map((l) => (
              <CartLineRow key={l.variantId} line={l} compact={compact} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function CartLineRow({line, compact}: {line: CartLine; compact: boolean}) {
  const {update, remove, setOpen} = useCart();
  const money = useMoney();
  const t = useT();
  return (
    <li className="flex gap-3 p-3">
      <Link to={`/products/${line.handle}`} onClick={() => setOpen(false)} className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md bg-page text-3xl md:size-20">
        {line.image ? <img src={imgUrl(line.image, 160)} alt="" className="size-full object-contain" /> : line.emoji}
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/products/${line.handle}`} onClick={() => setOpen(false)} className={`hover:text-link ${compact ? 'line-clamp-2 text-sm' : 'line-clamp-2'}`}>
          {line.title}
        </Link>
        {line.variantTitle ? <p className="text-xs text-muted">{line.variantTitle}</p> : null}
        <div className="mt-2 flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-muted">
            {t('cart.qty')}
            <select
              value={line.quantity}
              onChange={(e) => update(line.variantId, Number(e.target.value))}
              className="rounded-md border border-line bg-page px-1.5 py-1 text-sm text-ink"
            >
              {Array.from({length: Math.max(10, line.quantity)}, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => remove(line.variantId)} className="text-xs text-link hover:underline">
            {t('cart.remove')}
          </button>
        </div>
      </div>
      <p className="text-right font-semibold whitespace-nowrap">{money(line.price * line.quantity)}</p>
    </li>
  );
}

export function CartTotals({onNavigate, showViewCart = true}: {onNavigate?: () => void; showViewCart?: boolean}) {
  const {subtotal, lines, count} = useCart();
  const money = useMoney();
  const t = useT();
  const root = useRootData();
  const [state, setState] = useState<'idle' | 'loading' | 'demo' | 'error'>('idle');

  async function checkout() {
    setState('loading');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lines: lines.map((l) => ({merchandiseId: l.variantId, quantity: l.quantity}))}),
      });
      const data = (await res.json()) as {checkoutUrl?: string; demo?: boolean};
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setState(data.demo ? 'demo' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="space-y-3 border-t border-line p-4">
      <FreeShippingBar subtotal={subtotal} />
      <div className="flex items-baseline justify-between">
        <span>
          {t('cart.subtotal')} ({count})
        </span>
        <span className="text-xl font-bold">{money(subtotal)}</span>
      </div>
      <p className="text-xs text-muted">{t('cart.taxes')}</p>
      <button type="button" className="btn-cta w-full py-3 text-base" onClick={checkout} disabled={state === 'loading'}>
        {state === 'loading' ? '…' : t('cart.checkout')}
      </button>
      {state === 'demo' || (root?.isDemo && state === 'error') ? (
        <p className="rounded bg-o-importacion-bg p-2 text-xs text-o-importacion">{t('cart.demoCheckout')}</p>
      ) : state === 'error' ? (
        <p className="rounded bg-red-50 p-2 text-xs text-deal">Error. Intenta de nuevo.</p>
      ) : null}
      {showViewCart ? (
        <Link to="/cart" onClick={onNavigate} className="btn-ghost w-full">
          {t('cart.viewCart')}
        </Link>
      ) : null}
      <p className="flex items-center justify-center gap-1 text-xs text-muted">
        <IconShield className="size-4" /> {t('product.secure')}
      </p>
    </div>
  );
}
