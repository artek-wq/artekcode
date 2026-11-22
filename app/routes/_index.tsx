import {Link, useLoaderData} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/_index';
import {getCatalog, applyFilters} from '~/lib/catalog';
import {isOnSale, minPrice, type Product} from '~/lib/catalog/types';
import {ANIMALS, ANIMAL_KEYS, CATEGORIES, CATEGORY_KEYS, ORIGIN_KEYS} from '~/lib/config';
import {GUIDES, type Guide} from '~/content/guides';
import {freeShippingThreshold, getLocaleFromRequest, useLocale, useMoney, useT} from '~/lib/i18n';
import {OriginBadge, ProductCard, ProductThumb} from '~/components/product';
import {GuideCard, GuideDialog} from '~/components/guides';
import {IconChat, IconShield, IconTruck, IconUser} from '~/components/icons';

export async function loader({context, request}: Route.LoaderArgs) {
  const locale = getLocaleFromRequest(request);
  const all = await getCatalog(context, locale).getAllProducts();
  return {
    all,
    best: applyFilters(all, {sort: 'relevance'}).slice(0, 12),
    fast: applyFilters(all, {origin: ['nacional']}).slice(0, 4),
    deals: applyFilters(all, {deals: true}).slice(0, 4),
    uvb: applyFilters(all, {category: ['iluminacion', 'calefaccion']}).slice(0, 4),
    aqua: applyFilters(all, {animal: ['peces']}).slice(0, 4),
  };
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const t = useT();
  const locale = useLocale();
  const money = useMoney();
  const [guide, setGuide] = useState<Guide | null>(null);
  const products = Object.fromEntries(data.all.map((p) => [p.handle, p]));

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-ink-2 via-brand to-ink-2 text-white">
        <div className="container-x grid items-center gap-6 py-8 md:grid-cols-[1.4fr_1fr] md:py-12">
          <div>
            <h1 className="mb-3 text-3xl leading-tight font-extrabold md:text-5xl">{t('home.heroTitle')}</h1>
            <p className="mb-6 max-w-xl text-white/85 md:text-lg">{t('home.heroBody')}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/collections/all" className="btn-cta px-6 py-3 text-base">
                {t('home.heroCta')}
              </Link>
              <Link to="/guias" className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">
                📘 {t('home.heroGuide')}
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white/95 p-5 text-ink shadow-lg">
            <p className="font-bold">{t('legend.title')}</p>
            <p className="mb-3 text-sm text-muted">{t('legend.body')}</p>
            <ul className="space-y-2">
              {ORIGIN_KEYS.map((o) => (
                <li key={o}>
                  <Link to={`/collections/all?entrega=${o}`} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 hover:bg-page">
                    <OriginBadge origin={o} size="md" />
                    <span className="text-xs text-link">{t('home.seeAll')} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="border-b border-line bg-surface">
        <ul className="container-x grid grid-cols-2 gap-3 py-3 text-xs md:grid-cols-4 md:text-sm">
          <Trust icon={<IconTruck />} text={t('home.trust1', {amount: money(freeShippingThreshold(locale))})} />
          <Trust icon={<IconShield />} text={t('home.trust2')} />
          <Trust icon={<IconChat />} text={t('home.trust3')} />
          <Trust icon={<IconUser />} text={t('home.trust4')} />
        </ul>
      </section>

      <div className="container-x space-y-10 py-8">
        {/* POR ANIMAL */}
        <section>
          <h2 className="section-title mb-4">{t('home.shopByAnimal')}</h2>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {ANIMAL_KEYS.map((a, i) => (
              <li key={a}>
                <Link to={`/collections/${a}`} className="group flex flex-col items-center gap-2 text-center">
                  <span className={`grid aspect-square w-full max-w-36 place-items-center rounded-full text-5xl transition group-hover:scale-105 md:text-6xl ${['bg-tint-sand', 'bg-tint-leaf', 'bg-tint-water', 'bg-tint-sun', 'bg-brand-soft'][i]}`}>
                    {ANIMALS[a].emoji}
                  </span>
                  <span className="text-sm font-semibold group-hover:text-link">{ANIMALS[a][locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* TARJETAS 2x2 (inspiración Amazon, más simple) */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuadCard title={`💡 ${CATEGORIES.iluminacion[locale]}`} products={data.uvb} to="/collections/iluminacion" />
          <QuadCard title={`🐠 ${ANIMALS.peces[locale]}`} products={data.aqua} to="/collections/peces" />
          <QuadCard title={`🟢 ${t('home.fast')}`} products={data.fast} to="/collections/all?entrega=nacional" />
          <QuadCard title={`🏷️ ${t('home.deals')}`} products={data.deals} to="/collections/all?ofertas=1" />
        </section>

        {/* GUÍAS */}
        <section className="rounded-2xl bg-brand-soft p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="section-title">📘 {t('home.guides')}</h2>
              <p className="text-sm text-muted">{t('home.guidesBody')}</p>
            </div>
            <Link to="/guias" className="link text-sm">
              {t('home.seeAll')} →
            </Link>
          </div>
          <div className="scroll-row">
            {GUIDES.map((g) => (
              <GuideCard key={g.handle} guide={g} compact onOpen={() => setGuide(g)} />
            ))}
          </div>
        </section>

        {/* MÁS VENDIDOS */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="section-title">⭐ {locale === 'es' ? 'Los más vendidos' : 'Best sellers'}</h2>
            <Link to="/collections/all" className="link text-sm">
              {t('home.seeAll')} →
            </Link>
          </div>
          <div className="scroll-row">
            {data.best.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section>
          <h2 className="section-title mb-4">{t('home.shopByCategory')}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORY_KEYS.map((c) => (
              <li key={c}>
                <Link to={`/collections/${c}`} className="card flex items-center gap-3 p-3 hover:shadow-md">
                  <span className="text-3xl">{CATEGORIES[c].emoji}</span>
                  <span className="text-sm font-semibold">{CATEGORIES[c][locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <GuideDialog guide={guide} products={products} onClose={() => setGuide(null)} />
    </div>
  );
}

function Trust({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <li className="flex items-center gap-2 text-muted">
      <span className="text-brand">{icon}</span>
      {text}
    </li>
  );
}

function QuadCard({title, products, to}: {title: string; products: Product[]; to: string}) {
  const t = useT();
  const money = useMoney();
  return (
    <div className="card flex flex-col p-4">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {products.map((p) => (
          <Link key={p.id} to={`/products/${p.handle}`} className="group">
            <div className="overflow-hidden rounded-lg">
              <ProductThumb product={p} className="transition group-hover:scale-105" />
            </div>
            <p className="mt-1 line-clamp-1 text-xs group-hover:text-link">{p.title}</p>
            <p className="text-sm font-semibold">
              {money(minPrice(p))}
              {isOnSale(p) ? <span className="ml-1 text-[10px] font-bold text-deal">OFERTA</span> : null}
            </p>
          </Link>
        ))}
      </div>
      <Link to={to} className="link mt-3 text-sm">
        {t('home.seeAll')} →
      </Link>
    </div>
  );
}
