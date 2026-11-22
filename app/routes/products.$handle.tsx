import {Link, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/products.$handle';
import {getCatalog} from '~/lib/catalog';
import {getLocaleFromRequest, useLocale, useT} from '~/lib/i18n';
import {ANIMALS, CATEGORIES, STORE} from '~/lib/config';
import {GUIDES} from '~/content/guides';
import {
  AnimalChips,
  DeliveryEstimate,
  OriginBadge,
  Price,
  ProductCard,
  ProductThumb,
  Stars,
  WishlistButton,
  imgUrl,
} from '~/components/product';
import {useCart} from '~/components/providers';
import {GuideCard} from '~/components/guides';
import {IconChevron, IconShield} from '~/components/icons';

export async function loader({params, context, request}: Route.LoaderArgs) {
  const locale = getLocaleFromRequest(request);
  const catalog = getCatalog(context, locale);
  const product = await catalog.getProduct(params.handle!);
  if (!product) throw new Response('Not found', {status: 404});

  const all = await catalog.getAllProducts();
  const related = all
    .filter((p) => p.handle !== product.handle && p.animals.some((a) => product.animals.includes(a)))
    .sort((a, b) => Number(b.category !== product.category) - Number(a.category !== product.category) || (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);
  const guides = product.guides.map((h) => GUIDES.find((g) => g.handle === h)).filter(Boolean);
  return {product, related, guides, locale};
}

export const meta: Route.MetaFunction = ({data}) =>
  data
    ? [
        {title: `${data.product.title} · ${STORE.name}`},
        {name: 'description', content: data.product.description.slice(0, 155)},
      ]
    : [];

export default function ProductPage() {
  const {product, related, guides} = useLoaderData<typeof loader>();
  const t = useT();
  const locale = useLocale();
  const navigate = useNavigate();
  const {add} = useCart();
  const [params, setParams] = useSearchParams();
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  const variant =
    product.variants.find((v) => v.id.endsWith(`/${params.get('variante')}`) || v.title === params.get('variante')) ??
    product.variants.find((v) => v.available) ??
    product.variants[0];

  const selectVariant = (title: string) =>
    setParams(
      (prev) => {
        const sp = new URLSearchParams(prev);
        sp.set('variante', title);
        return sp;
      },
      {replace: true, preventScrollReset: true},
    );

  return (
    <div className="container-x py-4">
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link to={`/collections/${product.animals[0]}`} className="hover:underline">
          {ANIMALS[product.animals[0]]?.[locale]}
        </Link>
        <IconChevron className="size-3" />
        <Link to={`/collections/all?categoria=${product.category}`} className="hover:underline">
          {CATEGORIES[product.category][locale]}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_300px]">
        {/* Galería */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
            {product.images.length ? (
              <img src={imgUrl(product.images[imgIndex].url, 900)} alt={product.images[imgIndex].alt} className="aspect-square w-full object-contain" />
            ) : (
              <ProductThumb product={product} large />
            )}
            <WishlistButton handle={product.handle} className="absolute top-3 right-3" />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-2 flex gap-2">
              {product.images.map((img, i) => (
                <button key={img.url} type="button" onClick={() => setImgIndex(i)} className={`size-16 overflow-hidden rounded-md border-2 ${i === imgIndex ? 'border-cta' : 'border-line'}`}>
                  <img src={imgUrl(img.url, 160)} alt="" className="size-full object-contain" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Información */}
        <div>
          <p className="text-sm text-link">{product.brand}</p>
          <h1 className="mb-1 text-xl leading-snug font-semibold md:text-2xl">{product.title}</h1>
          <a href="#opiniones" className="mb-3 inline-block">
            <Stars rating={product.rating} count={product.reviewCount} />
          </a>
          <hr className="mb-3 border-line" />
          <Price amount={variant.price} compareAt={variant.compareAtPrice} size="lg" />

          {product.options.map((opt) => (
            <div key={opt.name} className="mt-5">
              <p className="mb-2 text-sm">
                {opt.name}: <strong>{variant.options[opt.name]}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const v = product.variants.find((x) => x.options[opt.name] === val);
                  const active = variant.options[opt.name] === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => selectVariant(val)}
                      disabled={!v?.available}
                      aria-pressed={active}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${active ? 'border-ink bg-brand-soft ring-1 ring-ink' : 'border-line bg-surface hover:border-muted'} disabled:line-through disabled:opacity-40`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {product.highlights.length ? (
            <ul className="mt-6 list-disc space-y-1.5 pl-5 text-sm">
              {product.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">{t('product.forAnimals')}</p>
            <AnimalChips animals={product.animals} />
          </div>
        </div>

        {/* Caja de compra */}
        <aside className="card h-fit space-y-3 p-4 lg:sticky lg:top-32">
          <Price amount={variant.price * qty} compareAt={variant.compareAtPrice ? variant.compareAtPrice * qty : null} />
          <OriginBadge origin={product.origin} size="md" />
          <DeliveryEstimate origin={product.origin} />
          {variant.available ? (
            <>
              <label className="flex items-center gap-2 text-sm">
                {t('cart.qty')}
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="rounded-md border border-line bg-page px-2 py-1.5">
                  {Array.from({length: 10}, (_, i) => i + 1).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn-cta w-full py-3" onClick={() => add(product, variant, qty)}>
                {t('product.addToCart')}
              </button>
              <button
                type="button"
                className="btn-dark w-full py-3"
                onClick={() => {
                  add(product, variant, qty);
                  navigate('/cart');
                }}
              >
                {t('product.buyNow')}
              </button>
            </>
          ) : (
            <p className="font-semibold text-deal">{t('product.soldOut')}</p>
          )}
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <IconShield className="size-4" /> {t('product.secure')}
          </p>
        </aside>
      </div>

      {/* Asesoría relacionada: discreta, debajo del producto */}
      {guides.length ? (
        <section className="mt-10">
          <h2 className="section-title mb-3">📘 {t('product.learnMore')}</h2>
          <div className="scroll-row">
            {guides.map((g) => (
              <GuideCard key={g!.handle} guide={g!} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="section-title mb-3">{t('product.description')}</h2>
          <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
        <div id="opiniones" className="card p-4">
          <h2 className="mb-2 font-bold">⭐ Opiniones</h2>
          <Stars rating={product.rating} count={product.reviewCount} />
          <p className="mt-3 text-xs text-muted">
            {/* Aquí se integra el widget de Judge.me cuando la tienda esté conectada. */}
            Las opiniones se mostrarán aquí con Judge.me al conectar la tienda.
          </p>
        </div>
      </section>

      {related.length ? (
        <section className="mt-10">
          <h2 className="section-title mb-3">{t('product.related')}</h2>
          <div className="scroll-row">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
