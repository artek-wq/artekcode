import {Link, useLoaderData, useSearchParams} from 'react-router';
import {useEffect, useState} from 'react';
import type {Route} from './+types/guias.$handle';
import {getGuide} from '~/content/guides';
import {GuideDialog, ProductHint, SlideView} from '~/components/guides';
import {ProductCard} from '~/components/product';
import {getCatalog} from '~/lib/catalog';
import {ANIMALS, STORE} from '~/lib/config';
import {getLocaleFromRequest, useLocale, useT} from '~/lib/i18n';
import {IconPlay} from '~/components/icons';

export async function loader({params, context, request}: Route.LoaderArgs) {
  const guide = getGuide(params.handle!);
  if (!guide) throw new Response('Not found', {status: 404});
  const all = await getCatalog(context, getLocaleFromRequest(request)).getAllProducts();
  return {guide, products: Object.fromEntries(all.map((p) => [p.handle, p]))};
}

export const meta: Route.MetaFunction = ({data}) =>
  data ? [{title: `${data.guide.title} · ${STORE.name}`}, {name: 'description', content: data.guide.summary}] : [];

export default function GuidePage() {
  const {guide, products} = useLoaderData<typeof loader>();
  const t = useT();
  const locale = useLocale();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (params.get('ver') === '1') setOpen(true);
  }, [params]);

  const close = () => {
    setOpen(false);
    if (params.get('ver')) setParams({}, {replace: true, preventScrollReset: true});
  };

  const kit = guide.kit.map((h) => products[h]).filter(Boolean);

  return (
    <article>
      <header className="bg-surface">
        <div className="container-x grid gap-6 py-6 md:grid-cols-[1fr_380px] md:items-center md:py-10">
          <div>
            <Link to={`/guias?animal=${guide.animal}`} className="text-sm text-link hover:underline">
              ← {ANIMALS[guide.animal].emoji} {ANIMALS[guide.animal][locale]}
            </Link>
            <h1 className="mt-2 mb-2 text-3xl font-extrabold md:text-4xl">{guide.title}</h1>
            <p className="mb-4 text-lg text-muted">{guide.summary}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="btn-cta" onClick={() => setOpen(true)}>
                <IconPlay className="size-4" /> {t('guides.view')} · {t('guides.slides', {n: guide.slides.length})}
              </button>
              <span className={`rounded-full px-3 py-1 text-xs ${guide.reviewed ? 'bg-o-nacional-bg text-o-nacional' : 'bg-o-importacion-bg text-o-importacion'}`}>
                {guide.reviewed ? `✔ ${t('guides.reviewed')}` : `⏳ ${t('guides.pendingReview')}`}
              </span>
            </div>
          </div>
          {/* Vista previa de la primera diapositiva (no cover) */}
          <button type="button" onClick={() => setOpen(true)} className="hidden rounded-2xl bg-tint-leaf p-4 text-left shadow-inner transition hover:shadow-md md:block" aria-label={t('guides.view')}>
            <div className="pointer-events-none origin-top scale-[0.8]">
              <SlideView slide={guide.slides[1] ?? guide.slides[0]} />
            </div>
          </button>
        </div>
      </header>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div className="max-w-2xl space-y-8">
          {guide.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-xl font-bold">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="mb-3 leading-relaxed">
                  {p}
                </p>
              ))}
              {s.product ? (
                <div className="mt-3 max-w-md">
                  <ProductHint product={products[s.product]} />
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="h-fit lg:sticky lg:top-32">
          <div className="card p-4">
            <h2 className="font-bold">🧰 {t('guides.kit')}</h2>
            <p className="mb-3 text-xs text-muted">{t('guides.kitBody')}</p>
            <div className="space-y-2">
              {kit.slice(0, 4).map((p) => (
                <ProductHint key={p.handle} product={p} label=" " />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {kit.length > 4 ? (
        <section className="container-x">
          <h2 className="section-title mb-3">{t('guides.kit')}</h2>
          <div className="scroll-row">
            {kit.map((p) => (
              <ProductCard key={p.handle} product={p} compact />
            ))}
          </div>
        </section>
      ) : null}

      <GuideDialog guide={open ? guide : null} products={products} onClose={close} />
    </article>
  );
}
