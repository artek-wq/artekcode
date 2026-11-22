import {Form, Link, useLocation, useNavigate} from 'react-router';
import {useState} from 'react';
import {ANIMALS, ANIMAL_KEYS, CATEGORIES, CATEGORY_KEYS, ORIGIN_KEYS} from '~/lib/config';
import {useLocale, useT} from '~/lib/i18n';
import {SORT_KEYS, type Product, type ProductFilters} from '~/lib/catalog/types';
import type {facetCounts} from '~/lib/catalog';
import {OriginBadge, ProductCard} from './product';
import {IconFilter, IconX} from './icons';

type Facets = ReturnType<typeof facetCounts>;

/** Devuelve la URL actual con el parámetro alternado (multi-valor). */
function useToggleHref() {
  const location = useLocation();
  return (key: string, value: string, multi = true) => {
    const sp = new URLSearchParams(location.search);
    const current = sp.getAll(key).flatMap((v) => v.split(','));
    sp.delete(key);
    const next = multi
      ? current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      : current.includes(value)
        ? []
        : [value];
    for (const v of next) sp.append(key, v);
    const qs = sp.toString();
    return `${location.pathname}${qs ? `?${qs}` : ''}`;
  };
}

export function ProductListing({
  title,
  subtitle,
  products,
  total,
  filters,
  facets,
  hide = [],
}: {
  title: string;
  subtitle?: React.ReactNode;
  products: Product[];
  total: number;
  filters: ProductFilters;
  facets: Facets;
  hide?: ('animal' | 'category')[];
}) {
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeCount =
    (filters.animal?.length ?? 0) +
    (filters.category?.length ?? 0) +
    (filters.origin?.length ?? 0) +
    (filters.brand?.length ?? 0) +
    (filters.minPrice != null ? 1 : 0) +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.deals ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const clearHref = (() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set('q', filters.q);
    const qs = sp.toString();
    return `${location.pathname}${qs ? `?${qs}` : ''}`;
  })();

  return (
    <div className="container-x py-4 md:py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted">
            {subtitle ? <>{subtitle} · </> : null}
            {t('list.results', {n: total})}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMobileOpen(true)} className="btn-ghost px-3 py-2 lg:hidden">
            <IconFilter className="size-4" /> {t('filters.title')}
            {activeCount ? <span className="rounded-full bg-ink px-1.5 text-xs text-white">{activeCount}</span> : null}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">{t('sort.label')}</span>
            <select
              className="rounded-lg border border-line bg-surface px-2 py-2 text-sm"
              value={filters.sort ?? 'relevance'}
              onChange={(e) => {
                const sp = new URLSearchParams(location.search);
                if (e.target.value === 'relevance') sp.delete('orden');
                else sp.set('orden', e.target.value);
                navigate(`${location.pathname}?${sp.toString()}`, {preventScrollReset: true});
              }}
            >
              {SORT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t(`sort.${k}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Leyenda de colores de entrega: rápida y siempre visible */}
      <OriginQuickFilter filters={filters} facets={facets} />

      <div className="mt-4 grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label={t('filters.title')}>
          <FilterPanel filters={filters} facets={facets} hide={hide} clearHref={activeCount ? clearHref : null} />
        </aside>

        <section>
          {products.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="mb-3 text-4xl">🔍</p>
              <p className="mb-4 text-muted">{t('list.none')}</p>
              <Link to={clearHref} className="btn-cta">
                {t('filters.clear')}
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('filters.title')}>
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-label={t('guides.close')} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="font-bold">{t('filters.title')}</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label={t('guides.close')}>
                <IconX />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <FilterPanel filters={filters} facets={facets} hide={hide} clearHref={activeCount ? clearHref : null} />
            </div>
            <div className="border-t border-line p-3">
              <button type="button" className="btn-cta w-full" onClick={() => setMobileOpen(false)}>
                {t('filters.show', {n: total})}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OriginQuickFilter({filters, facets}: {filters: ProductFilters; facets: Facets}) {
  const t = useT();
  const toggle = useToggleHref();
  return (
    <div className="scroll-row items-center">
      <span className="shrink-0 text-sm font-semibold">{t('origin.filter')}:</span>
      {ORIGIN_KEYS.map((o) => {
        const active = filters.origin?.includes(o);
        return (
          <Link
            key={o}
            to={toggle('entrega', o)}
            preventScrollReset
            aria-pressed={active}
            className={`shrink-0 rounded-full p-0.5 transition ${active ? 'ring-2 ring-ink' : 'opacity-90 hover:opacity-100'}`}
          >
            <span className="flex items-center gap-1">
              <OriginBadge origin={o} size="md" />
              <span className="pr-1 text-xs text-muted">({facets.origin[o]})</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function FilterPanel({
  filters,
  facets,
  hide,
  clearHref,
}: {
  filters: ProductFilters;
  facets: Facets;
  hide: ('animal' | 'category')[];
  clearHref: string | null;
}) {
  const t = useT();
  const locale = useLocale();
  const toggle = useToggleHref();
  const location = useLocation();
  const sp = new URLSearchParams(location.search);

  return (
    <div className="space-y-5 text-sm">
      {clearHref ? (
        <Link to={clearHref} className="link block">
          ✕ {t('filters.clear')}
        </Link>
      ) : null}

      <FilterGroup title={t('origin.filter')}>
        {ORIGIN_KEYS.map((o) => (
          <Check key={o} to={toggle('entrega', o)} checked={!!filters.origin?.includes(o)} count={facets.origin[o]}>
            <OriginBadge origin={o} />
          </Check>
        ))}
      </FilterGroup>

      {!hide.includes('animal') ? (
        <FilterGroup title={t('filters.animal')}>
          {ANIMAL_KEYS.map((a) => (
            <Check key={a} to={toggle('animal', a)} checked={!!filters.animal?.includes(a)} count={facets.animal[a]}>
              {ANIMALS[a].emoji} {ANIMALS[a][locale]}
            </Check>
          ))}
        </FilterGroup>
      ) : null}

      {!hide.includes('category') ? (
        <FilterGroup title={t('filters.category')}>
          {CATEGORY_KEYS.map((c) => (
            <Check key={c} to={toggle('categoria', c)} checked={!!filters.category?.includes(c)} count={facets.category[c]}>
              {CATEGORIES[c][locale]}
            </Check>
          ))}
        </FilterGroup>
      ) : null}

      <FilterGroup title={t('filters.price')}>
        <Form method="get" preventScrollReset className="flex items-center gap-2">
          {[...sp.entries()]
            .filter(([k]) => k !== 'min' && k !== 'max')
            .map(([k, v], i) => (
              <input key={`${k}${i}`} type="hidden" name={k} value={v} />
            ))}
          <input name="min" type="number" min={0} inputMode="numeric" defaultValue={filters.minPrice} placeholder={t('filters.min')} aria-label={t('filters.min')} className="w-20 rounded-md border border-line px-2 py-1.5" />
          <span>–</span>
          <input name="max" type="number" min={0} inputMode="numeric" defaultValue={filters.maxPrice} placeholder={t('filters.max')} aria-label={t('filters.max')} className="w-20 rounded-md border border-line px-2 py-1.5" />
          <button type="submit" className="rounded-md border border-line px-2 py-1.5 hover:bg-page">›</button>
        </Form>
      </FilterGroup>

      <FilterGroup title={t('filters.rating')}>
        {[4, 3].map((n) => (
          <Check key={n} to={toggle('estrellas', String(n), false)} checked={filters.minRating === n}>
            <span className="text-star">{'★'.repeat(n)}</span>
            <span className="text-line">{'★'.repeat(5 - n)}</span> {t('filters.ratingUp')}
          </Check>
        ))}
      </FilterGroup>

      <FilterGroup title={t('home.deals')}>
        <Check to={toggle('ofertas', '1', false)} checked={!!filters.deals}>
          {t('filters.deals')}
        </Check>
        <Check to={toggle('disponible', '1', false)} checked={!!filters.inStock}>
          {t('filters.inStock')}
        </Check>
      </FilterGroup>

      <FilterGroup title={t('filters.brand')}>
        {Object.entries(facets.brand).map(([b, n]) => (
          <Check key={b} to={toggle('marca', b)} checked={!!filters.brand?.includes(b)} count={n}>
            {b}
          </Check>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({to, checked, count, children}: {to: string; checked: boolean; count?: number; children: React.ReactNode}) {
  const disabled = count === 0 && !checked;
  return (
    <Link
      to={to}
      preventScrollReset
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      className={`flex items-center gap-2 rounded px-1 py-1 hover:bg-page ${disabled ? 'pointer-events-none opacity-40' : ''}`}
    >
      <span className={`grid size-4 shrink-0 place-items-center rounded border ${checked ? 'border-ink bg-ink text-white' : 'border-muted/60 bg-surface'}`}>
        {checked ? <svg viewBox="0 0 12 12" className="size-3" aria-hidden><path d="M2.5 6.5 5 9l4.5-6" fill="none" stroke="currentColor" strokeWidth="2" /></svg> : null}
      </span>
      <span className="flex-1">{children}</span>
      {count != null ? <span className="text-xs text-muted">{count}</span> : null}
    </Link>
  );
}
